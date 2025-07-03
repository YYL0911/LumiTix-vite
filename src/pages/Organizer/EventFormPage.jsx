import { useState, useEffect, useMemo, memo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
// Context
import { useAuth } from "../../contexts/AuthContext";
// 元件
import axios from "axios";
import Swal from "sweetalert2";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../assets/scss/pages/EventFormPage.scss";
import zhTW from "date-fns/locale/zh-TW"; // 引入繁體中文語系
registerLocale("zh-TW", zhTW); // 註冊語系
import Breadcrumb from "../../conponents/Breadcrumb";
import Loading from "../../conponents/Loading";
import RichTextEditor from "../../conponents/RichTextEditor";
// --- 9.場地圖 的 import ---
import venuePreview from "../../assets/img/venuePreview.png";
// --- dnd-kit 分區設定拖曳套件---
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay, // 可選，用於更平滑的拖曳預覽
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"; // 用於 transform/transition 樣式

// --- 在此加入新的圖片上傳輔助函式 ---
const uploadImage = async (file, type, userToken) => {
  const formData = new FormData();
  formData.append("image", file); // 假設後端接收的欄位名是 'image'
  formData.append("type", type); // 將 type 加入 FormData 中
  const response = await axios.post("https://n7-backend.onrender.com/api/v1/organizer/upload_image", formData, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });
  // 重要確認：假設 API 回傳的圖片網址欄位是 'image_url'
  return response.data.data.image_url;
};

// --- 在這裡加入新的日期格式化函式 ---
const formatDateForApi = (date, time) => {
  if (!date || !time) return null;
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  // 回傳 YYYY-MM-DD HH:MM:SS 格式
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
// 從完整地址中拆分出城市和街道地址
const splitAddress = (fullAddress, cities) => {
  const foundCity = cities.find((city) => fullAddress.startsWith(city));
  if (foundCity) {
    const streetAddress = fullAddress.substring(foundCity.length).trim();
    return { city: foundCity, streetAddress };
  }
  // 如果找不到匹配的城市，將整個地址視為街道地址
  return { city: "", streetAddress: fullAddress };
};
// 定義此頁面的麵包屑靜態結構
const breadcrumb = [{ name: "首頁", path: "/" }, { name: "活動訂單", path: "/events" }, { name: "活動資訊新增/編輯" }];

// --- 可拖曳的分區項目元件 ---
const SortableZoneItem = ({ id, zone, index, handleZoneChange, handleRemoveZone }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging, // 可以用來改變拖曳中的樣式
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1, // 拖曳時稍微透明
    boxShadow: isDragging ? "0 4px 8px rgba(0,0,0,0.1)" : "none", // 拖曳時加上陰影
  };

  // 為票價建立一個有千分位格式的顯示值
  const formattedPrice = useMemo(() => {
    if (zone.price === null || zone.price === "") return "";
    // 使用 Intl.NumberFormat 來安全地格式化數字
    return new Intl.NumberFormat("en-US").format(zone.price);
  }, [zone.price]);

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="row gx-2 gy-3 align-items-center mb-3">
      {/* 移動圖示 (drag handle) */}
      <div
        {...listeners}
        className="col-2 text-center d-flex align-items-center justify-content-center"
        style={{ cursor: "grab", touchAction: "none" }}
      >
        <i className="bi bi-grip-vertical" style={{ fontSize: "1.2rem", color: "#6c757d" }}></i>
      </div>

      {/* 分區名稱 */}
      <div className="col-3">
        <label htmlFor={`zoneName-${id}`} className="form-label d-md-none visually-hidden">
          分區名稱
        </label>
        <input
          type="text"
          className="form-control form-control-sm"
          id={`zoneName-${id}`}
          placeholder="｢A區」請輸入「A」"
          value={zone.name}
          onChange={(e) => handleZoneChange(index, "name", e.target.value)}
        />
      </div>
      {/* 票價 */}
      <div className="col-3">
        <label htmlFor={`zonePrice-${id}`} className="form-label d-md-none visually-hidden">
          票價
        </label>
        <div className="input-group input-group-sm">
          <input
            type="text"
            inputMode="numeric"
            className="form-control"
            id={`zonePrice-${id}`}
            placeholder="0"
            value={formattedPrice}
            onChange={(e) => handleZoneChange(index, "price", e.target.value)}
          />
        </div>
      </div>
      {/* 票數 */}
      <div className="col-2">
        <label htmlFor={`zoneTickets-${id}`} className="form-label d-md-none visually-hidden">
          票數
        </label>
        <input
          type="text"
          inputMode="numeric"
          className="form-control form-control-sm"
          id={`zoneTickets-${id}`}
          placeholder="0"
          value={zone.tickets}
          onChange={(e) => handleZoneChange(index, "tickets", e.target.value)}
        />
      </div>
      {/* 移除按鈕 */}
      <div className="col-2 d-flex align-items-center">
        <button type="button" className="btn btn-outline-danger btn-sm w-100" onClick={() => handleRemoveZone(index)}>
          <i className="bi bi-trash-fill"></i>
        </button>
      </div>
    </div>
  );
};

const EventFormPage = () => {
  const { eventId } = useParams(); // 從 URL 取得 eventId
  const navigate = useNavigate();
  const { userToken, eventTypesOri } = useAuth();
  const [apiLoading, setApiLoading] = useState(false); // API 請求中的 loading 狀態
  const isEditMode = !!eventId; // 判斷是否為編輯模式
  //處理驗證邏輯
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
    getValues,
  } = useForm({
    // 加上 defaultValues 物件，並列出所有需要驗證的欄位
    defaultValues: {
      eventName: "",
      eventVenue: "",
      eventCity: "",
      eventStreetAddress: "",
      performanceStartDate: null,
      performanceStartTime: null,
      performanceEndDate: null,
      performanceEndTime: null,
      ticketSalesStartDate: null,
      ticketSalesStartTime: null,
      ticketSalesEndDate: null,
      ticketSalesEndTime: null,
      eventType: "",
      eventCoverImage: null,
      venueMapImage: null,
    },
    mode: "onTouched",
  });
  
  // --- 監控所有日期欄位的變化，以便動態更新 UI ---
  const performanceStartDate = watch("performanceStartDate");
  const ticketSalesStartDate = watch("ticketSalesStartDate");

  // --- 驗證邏輯函式 ---
  const validateDates = () => {
    const {
      performanceStartDate,
      performanceStartTime,
      performanceEndDate,
      performanceEndTime,
      ticketSalesStartDate,
      ticketSalesStartTime,
      ticketSalesEndDate,
      ticketSalesEndTime,
    } = getValues();

    const getCombinedDate = (date, time) => {
      if (!date || !time) return null;
      return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes());
    };

    const now = new Date();
    // 將 now 的秒和毫秒設為 0，以便和選擇器的時間（只有時/分）精確比較
    now.setSeconds(0, 0);

    const pStart = getCombinedDate(performanceStartDate, performanceStartTime);
    const pEnd = getCombinedDate(performanceEndDate, performanceEndTime);
    const tStart = getCombinedDate(ticketSalesStartDate, ticketSalesStartTime);
    const tEnd = getCombinedDate(ticketSalesEndDate, ticketSalesEndTime);

    if (pStart && pStart < now) return "演出開始時間不能早於現在";
    if (tStart && tStart < now) return "售票開始時間不能早於現在";
    if (pStart && pEnd && pEnd < pStart) return "演出開始時間不能晚於演出結束時間";
    if (tStart && tEnd && tEnd < tStart) return "售票結束時間不能早於售票開始時間";
    if (tEnd && pStart && tEnd > pStart) return "售票結束時間不能晚於演出開始時間";

    return true; // 所有驗證通過
  };

  const [locationData] = useState([
    "請選擇城市",
    "台北市",
    "新北市",
    "桃園市",
    "台中市",
    "台南市",
    "高雄市",
    "基隆市",
    "新竹市",
    "嘉義市",
    "新竹縣",
    "苗栗縣",
    "彰化縣",
    "南投縣",
    "雲林縣",
    "嘉義縣",
    "屏東縣",
    "宜蘭縣",
    "花蓮縣",
    "台東縣",
    "澎湖縣",
    "金門縣",
    "連江縣",
  ]);

  // 建立 活動封面照 ref 來存取隱藏的 file input
  const [coverImagePreview, setCoverImagePreview] = useState(null); // 新增 state 圖片預覽
  // 建立 場地圖 ref 來存取隱藏的 file input
  const [venueMapPreview, setVenueMapPreview] = useState(null); //
  // 模擬分區設定的 state (之後會被 react-hook-form 的 useFieldArray 取代)
  const [zones, setZones] = useState([]); // 初始為空陣列，等待 API 或使用者新增
  const [activeDragId, setActiveDragId] = useState(null); // 用於 DragOverlay

  useEffect(() => {
    // 狀況一：進入「新增模式」
    // 如果 isEditMode 是 false，代表現在是 /new 的路徑
    if (!isEditMode) {
      //console.log("偵測到進入「新增模式」，正在清空表單...");
      // 1. 重設 react-hook-form 的所有欄位
      reset({
        eventName: "",
        eventVenue: "",
        eventCity: "",
        eventStreetAddress: "",
        performanceStartDate: null,
        performanceStartTime: null,
        performanceEndDate: null,
        performanceEndTime: null,
        ticketSalesStartDate: null,
        ticketSalesStartTime: null,
        ticketSalesEndDate: null,
        ticketSalesEndTime: null,
        eventType: "",
        eventCoverImage: null,
        venueMapImage: null,
      });
      // 2. 清空我們手動管理的 state
      setZones([]);
      setCoverImagePreview(null);
      setVenueMapPreview(null);
      // 3. 清空完畢，結束這個 effect
      return;
    }

    // 狀況二：進入「編輯模式」
    // 如果 isEditMode 是 true，且其他依賴項已準備好，就去抓取資料
    if (userToken && eventTypesOri && eventTypesOri.length > 0) {
      const fetchEventData = async () => {
        setApiLoading(true);
        try {
          const url = `https://n7-backend.onrender.com/api/v1/organizer/events/${eventId}`;
          const response = await axios.get(url, { headers: { Authorization: `Bearer ${userToken}` } });
          const eventData = response.data.data;
          if (!eventData) {
            throw new Error("API 回應中缺少 data 物件");
          }
          const { city, streetAddress } = splitAddress(eventData.address, locationData);
          const currentType = eventTypesOri.find((t) => t.name === eventData.type);
          const currentTypeId = currentType ? currentType.id : "";
          reset({
            eventName: eventData.title,
            eventVenue: eventData.location,
            eventCity: city,
            eventStreetAddress: streetAddress,
            performers: eventData.performance_group,
            eventDescription: eventData.description,
            eventType: currentTypeId,
            performanceStartDate: new Date(eventData.start_at.slice(0, -1)),
            performanceStartTime: new Date(eventData.start_at.slice(0, -1)),
            performanceEndDate: new Date(eventData.end_at.slice(0, -1)),
            performanceEndTime: new Date(eventData.end_at.slice(0, -1)),
            ticketSalesStartDate: new Date(eventData.sale_start_at.slice(0, -1)),
            ticketSalesStartTime: new Date(eventData.sale_start_at.slice(0, -1)),
            ticketSalesEndDate: new Date(eventData.sale_end_at.slice(0, -1)),
            ticketSalesEndTime: new Date(eventData.sale_end_at.slice(0, -1)),
          });
          setCoverImagePreview(eventData.cover_image_url);
          setVenueMapPreview(eventData.section_image_url);

          const formattedZones = eventData.sections.map((section, index) => ({
            id: section.id || `api-zone-${index}`,
            name: section.section_name, // 對應 section_name
            price: section.price.toString(),
            tickets: section.ticket_total.toString(), // 對應 ticket_total
          }));
          setZones(formattedZones);
        } catch (error) {
          // --- 建議的完整錯誤處理邏輯 ---
          console.error("載入活動資料失敗!", error.response || error);
          // 從 error 物件中，提取後端回傳的狀態碼和錯誤訊息
          const statusCode = error.response?.status;
          const errorMessage = error.response?.data?.message || "發生未知錯誤，請稍後再試。";
          // 狀況一：401 未授權 (Token 失效或未登入)
          if (statusCode === 401) {
            Swal.fire("驗證失敗", "您尚未登入或登入已逾時，請重新登入。", "error").then(() => navigate("/login"));
          }
          // 狀況二：403 禁止 (使用者沒有權限編輯此活動)
          else if (statusCode === 403) {
            Swal.fire("權限不足", "您沒有權限編輯此活動。", "error").then(() => navigate("/events"));
          }
          // 狀況三：404 找不到 (使用者想編輯一個不存在或已被刪除的活動)
          else if (statusCode === 404) {
            Swal.fire("找不到資料", "找不到您要編輯的活動，它可能已被刪除。", "error").then(() => navigate("/events"));
          }
          // 狀況四：其他所有錯誤 (例如 500 伺服器內部錯誤)
          else {
            Swal.fire("載入失敗", `發生錯誤：\n${errorMessage}`, "error").then(() => navigate("/events"));
          }
        } finally {
          setApiLoading(false);
        }
      };
      fetchEventData();
    }
  }, [isEditMode, eventId, userToken, navigate, reset, locationData, eventTypesOri]);

  // 新增分區的處理函式 (簡易版，之後 useFieldArray 會提供 append)
  const handleAddZone = () => {
    setZones([...zones, { id: `zone${Date.now()}`, name: "", price: "", tickets: "" }]);
  };
  // 移除分區的處理函式 (簡易版，之後 useFieldArray 會提供 remove)
  const handleRemoveZone = (indexToRemove) => {
    setZones(zones.filter((_, index) => index !== indexToRemove));
  };

  // 更新分區資料的處理函式
  const handleZoneChange = (index, field, value) => {
    const newZones = [...zones];
    let processedValue = value;

    if (field === "price" || field === "tickets") {
      // 1. 只保留數字
      const numericValue = value.replace(/[^0-9]/g, "");
      // 2. 檢查是否為空，如果是則設為空字串，允許使用者清空輸入框
      if (numericValue === "") {
        processedValue = "";
      } else {
        // 3. 轉換為數字再轉回字串，去除開頭多餘的 '0' (例如 '05' -> '5')
        const num = parseInt(numericValue, 10);
        if (!isNaN(num)) {
          processedValue = num.toString();
        } else {
          processedValue = ""; // 如果解析失敗，也清空
        }
      }
    }
    newZones[index][field] = processedValue;
    setZones(newZones);
  };
  // --- dnd-kit: Sensors ---
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // 拖曳超過 8px 才啟動 (可以試試 5px, 10px 等)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // --- dnd-kit: Drag Handlers ---
  const handleDragStart = (event) => {
    setActiveDragId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (over && active.id !== over.id) {
      setZones((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  const activeZone = activeDragId ? zones.find((zone) => zone.id === activeDragId) : null;

  // 監控 eventCoverImage 欄位的變化以更新預覽
  const eventCoverImageFile = watch("eventCoverImage");
  useEffect(() => {
    if (eventCoverImageFile && eventCoverImageFile[0]) {
      const file = eventCoverImageFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [eventCoverImageFile]);
  // 監控 venueMapImage 欄位的變化以更新預覽
  const venueMapImageFile = watch("venueMapImage");
  useEffect(() => {
    if (venueMapImageFile && venueMapImageFile[0]) {
      const file = venueMapImageFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setVenueMapPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [venueMapImageFile]);
  // 提交審核
  const onSubmit = async (data) => {
    setApiLoading(true);
    try {
      let coverImageUrl = coverImagePreview; // 預設為現有的圖片預覽 URL
      let venueMapImageUrl = venueMapPreview;
      // --- 步驟一：如果使用者上傳了新圖片，就先上傳圖片 ---
      const uploadPromises = [];
      // 檢查是否有新的活動封面照
      if (data.eventCoverImage && data.eventCoverImage[0]) {
        //console.log("偵測到新的封面圖，準備上傳...");
        uploadPromises.push(
          // --- 在此傳入 'cover' ---
          uploadImage(data.eventCoverImage[0], "cover", userToken).then((url) => {
            coverImageUrl = url;
            //console.log("封面圖上傳成功，URL:", url);
          })
        );
      }

      // 檢查是否有新的場地圖
      if (data.venueMapImage && data.venueMapImage[0]) {
        //console.log("偵測到新的場地圖，準備上傳...");
        uploadPromises.push(
          // --- 在此傳入 'section' ---
          uploadImage(data.venueMapImage[0], "section", userToken).then((url) => {
            venueMapImageUrl = url;
            //console.log("場地圖上傳成功，URL:", url);
          })
        );
      }
      // 等待所有圖片上傳完成
      await Promise.all(uploadPromises);
      //console.log("所有圖片處理完畢。");

      // --- 步驟二：準備並提交主要的活動資料 (JSON) ---
      const apiData = {
        title: data.eventName,
        location: data.eventVenue,
        address: `${data.eventCity} ${data.eventStreetAddress}`,
        start_at: formatDateForApi(data.performanceStartDate, data.performanceStartTime),
        end_at: formatDateForApi(data.performanceEndDate, data.performanceEndTime),
        sale_start_at: formatDateForApi(data.ticketSalesStartDate, data.ticketSalesStartTime),
        sale_end_at: formatDateForApi(data.ticketSalesEndDate, data.ticketSalesEndTime),
        performance_group: data.performers,
        description: data.eventDescription,
        type_id: data.eventType,
        cover_image_url: coverImageUrl,
        section_image_url: venueMapImageUrl,
        sections: zones.map((zone) => {
          const sectionData = {
            section_name: zone.name,
            price: parseInt(zone.price, 10),
            ticket_total: parseInt(zone.tickets, 10),
          };
          if (zone.id && !String(zone.id).startsWith("zone")) {
            sectionData.id = zone.id;
          }
          return sectionData;
        }),
      };

      const headers = { "Content-Type": "application/json", Authorization: `Bearer ${userToken}` };
      let response;

      if (isEditMode) {
        // 編輯模式，使用 PUT
        const url = `https://n7-backend.onrender.com/api/v1/organizer/events/${eventId}`;
        response = await axios.put(url, apiData, { headers });
      } else {
        // 新增模式，使用 POST
        const url = "https://n7-backend.onrender.com/api/v1/organizer/propose-event";
        response = await axios.post(url, apiData, { headers });
      }
      // --- 修改 onSubmit 的成功/失敗提示 ---
      if (response.data.status) {
        await Swal.fire({
          title: "操作成功！",
          text: isEditMode ? "活動更新成功！" : "活動新增成功！",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/events");
      } else {
        throw new Error(response.data.message || "回傳狀態錯誤");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "發生未知錯誤，請稍後再試";
      console.error("Submit failed:", error.response || error);
      Swal.fire("操作失敗！", errorMessage, "error");
    } finally {
      setApiLoading(false);
    }
  };

  if (apiLoading) {
    return <Loading />;
  }

  return (
    <div className="bg-body-tertiary">
      <div className="container py-3">
        <Breadcrumb breadcrumbs={breadcrumb} />
        <h1 className="my-5">活動提案</h1>
        <h2 className="h4 border-top border-bottom border-2 border-secondary my-5 py-3">活動資訊</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <div className="row">
              {/* 1. 活動封面 */}
              <div className="col-md-4">
                <div className="mb-5">
                  <label className="text-muted form-label">
                    活動封面照 <span className="text-danger">*</span>
                  </label>
                  <small className="text-muted d-block mb-2">
                    請上傳橫向圖片（JPG 或 PNG 格式），檔案大小需低於 5MB。
                  </small>
                  {/* 使用 Controller 包裹自訂的上傳區塊 */}
                  <Controller
                    name="eventCoverImage"
                    control={control}
                    rules={{
                      // 只有在「非」編輯模式，或「是」編輯模式但「沒有」圖片預覽時，此欄位才是必填
                      required: !isEditMode || (isEditMode && !coverImagePreview) ? "請上傳活動封面照" : false,
                    }}
                    render={({ field: { onChange, onBlur, name, ref } }) => (
                      <>
                        <div
                          className={`bg-white border border-2 text-center ${
                            errors.eventCoverImage ? "border-danger" : ""
                          }`}
                          style={{
                            borderStyle: "dashed",
                            borderRadius: "0.375rem",
                            cursor: "pointer",
                            minHeight: "240px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            overflow: "hidden",
                          }}
                          onClick={() => document.getElementById("eventCoverImage_input").click()}
                          role="button"
                          tabIndex={0}
                        >
                          {coverImagePreview ? (
                            <img
                              src={coverImagePreview}
                              alt="封面預覽"
                              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                            />
                          ) : (
                            <>
                              <i className="bi bi-upload mb-3" style={{ fontSize: "2rem", color: "#6c757d" }}></i>
                              <p className="text-muted mb-0">請上傳圖片</p>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          id="eventCoverImage_input"
                          style={{ display: "none" }}
                          accept="image/*"
                          // 將 react-hook-form 的 props 綁定到隱藏的 input 上
                          name={name}
                          ref={ref}
                          onBlur={onBlur}
                          onChange={(e) => {
                            // 當檔案選擇改變時，將 FileList 物件傳遞給 react-hook-form
                            onChange(e.target.files);
                          }}
                        />
                      </>
                    )}
                  />
                  {/* 顯示錯誤訊息 */}
                  {errors.eventCoverImage && (
                    <small className="text-danger mt-1 d-block">{errors.eventCoverImage.message}</small>
                  )}
                </div>
              </div>
              {/* 2. 活動名稱 */}
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <label htmlFor="eventName" className="text-muted form-label">
                    活動名稱<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.eventName ? "is-invalid" : ""}`}
                    id="eventName"
                    placeholder="例如：台北愛樂《春之頌》交響音樂會"
                    {...register("eventName", { required: "活動名稱為必填" })}
                  />
                  <div className="invalid-feedback">{errors.eventName?.message}</div>
                </div>
                {/* 3. 活動地點 */}
                <div className="col-md-6">
                  <label htmlFor="eventVenue" className="text-muted form-label">
                    活動地點<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.eventVenue ? "is-invalid" : ""}`}
                    id="eventVenue"
                    placeholder="例如：臺北國家音樂廳"
                    {...register("eventVenue", { required: "活動地點為必填" })}
                  />
                  <div className="invalid-feedback">{errors.eventVenue?.message}</div>
                </div>
              </div>
              {/* 4. 地址 (城市 + 詳細地址) */}
              <div className="mb-4">
                <label className="text-muted form-label">
                  地址<span className="text-danger">*</span>
                </label>
                <div className="row g-3">
                  <div className="col-md-3">
                    <select
                      className={`form-select select-dark-arrow ${errors.eventCity ? "is-invalid" : ""}`}
                      id="eventCity"
                      {...register("eventCity", { required: "請選擇城市" })}
                    >
                      {locationData.map((city, index) => (
                        <option key={index} value={index === 0 ? "" : city} disabled={index === 0}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-9">
                    <input
                      type="text"
                      className={`form-control ${errors.eventStreetAddress ? "is-invalid" : ""}`}
                      id="eventStreetAddress"
                      placeholder="例如：中正區中山南路21-1號"
                      {...register("eventStreetAddress", { required: "請輸入詳細地址" })}
                    />
                  </div>
                </div>
                {(errors.eventCity || errors.eventStreetAddress) && (
                  <small className="text-danger mt-1 d-block">
                    {errors.eventCity?.message || errors.eventStreetAddress?.message}
                  </small>
                )}
              </div>
              {/* 5. 演出開始時間 & 6. 演出結束時間 */}
              <div className="row g-3 mb-4">
                {/* 左半邊：演出開始時間 */}
                <div className="col-md-6">
                  <label className="text-muted form-label d-block">
                    演出開始時間 <span className="text-danger">*</span>
                  </label>
                  <div className="row g-2">
                    <div className="col-6">
                      <Controller
                        name="performanceStartDate"
                        control={control}
                        rules={{ required: "請選擇開始日期", validate: validateDates }}
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            selected={field.value}
                            minDate={new Date()}
                            onChange={(date) => {
                              field.onChange(date);
                            }}
                            className={`form-control ${errors.performanceStartDate ? "is-invalid" : ""}`}
                            dateFormat="yyyy-MM-dd (eee)"
                            placeholderText="年 / 月 / 日"
                            isClearable
                            locale="zh-TW"
                          />
                        )}
                      />
                    </div>
                    <div className="col-6">
                      <Controller
                        name="performanceStartTime"
                        control={control}
                        rules={{ required: "請選擇開始時間", validate: validateDates }}
                        render={({ field }) => {
                          const isToday =
                            performanceStartDate &&
                            new Date(performanceStartDate).toDateString() === new Date().toDateString();
                          return (
                            <DatePicker
                              {...field}
                              selected={field.value}
                              minTime={isToday ? new Date() : null}
                              maxTime={isToday ? new Date(new Date().setHours(23, 59)) : null}
                              onChange={(date) => {
                                field.onChange(date);
                              }}
                              onBlur={field.onBlur}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={30}
                              timeCaption="時間"
                              dateFormat="HH:mm"
                              timeFormat="HH:mm"
                              className={`form-control ${errors.performanceStartTime ? "is-invalid" : ""}`}
                              placeholderText="時 : 分"
                              isClearable
                              locale="zh-TW"
                            />
                          );
                        }}
                      />
                    </div>
                  </div>
                  {/* 錯誤訊息提示區塊 */}
                  {(errors.performanceStartDate || errors.performanceStartTime) && (
                    <small className="text-danger mt-1 d-block">
                      {errors.performanceStartDate?.message || errors.performanceStartTime?.message}
                    </small>
                  )}
                </div>
                {/* 右半邊：演出結束時間 */}
                <div className="col-md-6">
                  <label className="text-muted form-label d-block">
                    演出結束時間<span className="text-danger">*</span>
                  </label>
                  <div className="row g-2">
                    <div className="col-6">
                      <Controller
                        name="performanceEndDate"
                        control={control}
                        rules={{ required: "請選擇結束日期", validate: validateDates }}
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            selected={field.value}
                            minDate={performanceStartDate || new Date()}
                            onChange={(date) => {
                              field.onChange(date);
                            }}
                            onBlur={field.onBlur}
                            className={`form-control ${errors.performanceEndDate ? "is-invalid" : ""}`}
                            dateFormat="yyyy-MM-dd (eee)"
                            placeholderText="年 / 月 / 日"
                            isClearable
                            locale="zh-TW"
                          />
                        )}
                      />
                    </div>
                    <div className="col-6">
                      <Controller
                        name="performanceEndTime"
                        control={control}
                        rules={{ required: "請選擇結束時間", validate: validateDates }}
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            selected={field.value}
                            onChange={(date) => {
                              field.onChange(date);
                            }}
                            onBlur={field.onBlur}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={30}
                            timeCaption="時間"
                            dateFormat="HH:mm"
                            timeFormat="HH:mm"
                            className={`form-control ${errors.performanceEndTime ? "is-invalid" : ""}`}
                            placeholderText="時 : 分"
                            isClearable
                            locale="zh-TW"
                          />
                        )}
                      />
                    </div>
                  </div>
                  {(errors.performanceEndDate || errors.performanceEndTime) && (
                    <small className="text-danger mt-1 d-block">
                      {errors.performanceEndDate?.message || errors.performanceEndTime?.message}
                    </small>
                  )}
                </div>
              </div>
              {/* 7. 售票開始時間 (日期 + 時間) */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="text-muted form-label d-block">
                    售票開始時間<span className="text-danger">*</span>
                  </label>
                  <div className="row g-2">
                    <div className="col-6">
                      <Controller
                        name="ticketSalesStartDate"
                        control={control}
                        rules={{ required: "請選擇售票日期", validate: validateDates }}
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            selected={field.value}
                            minDate={new Date()}
                            maxDate={performanceStartDate || null}
                            onChange={(date) => {
                              field.onChange(date);
                            }}
                            onBlur={field.onBlur}
                            className={`form-control ${errors.ticketSalesStartDate ? "is-invalid" : ""}`}
                            dateFormat="yyyy-MM-dd (eee)"
                            placeholderText="年 / 月 / 日"
                            isClearable
                            locale="zh-TW"
                          />
                        )}
                      />
                    </div>
                    <div className="col-6">
                      <Controller
                        name="ticketSalesStartTime"
                        control={control}
                        rules={{ required: "請選擇售票時間", validate: validateDates }}
                        render={({ field }) => {
                          const isToday =
                            ticketSalesStartDate &&
                            new Date(ticketSalesStartDate).toDateString() === new Date().toDateString();
                          return (
                            <DatePicker
                              {...field}
                              selected={field.value}
                              minTime={isToday ? new Date() : null}
                              maxTime={isToday ? new Date(new Date().setHours(23, 59)) : null}
                              onChange={(date) => {
                                field.onChange(date);
                              }}
                              onBlur={field.onBlur}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={30}
                              timeCaption="時間"
                              dateFormat="HH:mm"
                              timeFormat="HH:mm"
                              className={`form-control ${errors.ticketSalesStartTime ? "is-invalid" : ""}`}
                              placeholderText="時 : 分"
                              isClearable
                              locale="zh-TW"
                            />
                          );
                        }}
                      />
                    </div>
                  </div>
                  {(errors.ticketSalesStartDate || errors.ticketSalesStartTime) && (
                    <small className="text-danger mt-1 d-block">
                      {errors.ticketSalesStartDate?.message || errors.ticketSalesStartTime?.message}
                    </small>
                  )}
                </div>
                {/* 8. 售票結束時間 (日期 + 時間) */}
                <div className="col-md-6">
                  <label className="text-muted form-label d-block">
                    售票截止時間<span className="text-danger">*</span>
                  </label>
                  <div className="row g-2">
                    <div className="col-6">
                      <Controller
                        name="ticketSalesEndDate"
                        control={control}
                        rules={{ required: "請選擇截止日期", validate: validateDates }}
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            selected={field.value}
                            minDate={ticketSalesStartDate || new Date()}
                            maxDate={performanceStartDate || null}
                            onChange={(date) => {
                              field.onChange(date);
                            }}
                            onBlur={field.onBlur}
                            className={`form-control ${errors.ticketSalesEndDate ? "is-invalid" : ""}`}
                            dateFormat="yyyy-MM-dd (eee)"
                            placeholderText="年 / 月 / 日"
                            isClearable
                            locale="zh-TW"
                          />
                        )}
                      />
                    </div>
                    <div className="col-6">
                      <Controller
                        name="ticketSalesEndTime"
                        control={control}
                        rules={{ required: "請選擇截止時間", validate: validateDates }}
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            selected={field.value}
                            onChange={(date) => {
                              field.onChange(date);
                            }}
                            onBlur={field.onBlur}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={30}
                            timeCaption="時間"
                            dateFormat="HH:mm"
                            timeFormat="HH:mm"
                            className={`form-control ${errors.ticketSalesEndTime ? "is-invalid" : ""}`}
                            placeholderText="時 : 分"
                            isClearable
                            locale="zh-TW"
                          />
                        )}
                      />
                    </div>
                  </div>
                  {(errors.ticketSalesEndDate || errors.ticketSalesEndTime) && (
                    <small className="text-danger mt-1 d-block">
                      {errors.ticketSalesEndDate?.message || errors.ticketSalesEndTime?.message}
                    </small>
                  )}
                </div>
              </div>
              {/* 9. 場地圖 */}
              <div className="col-md-4">
                <div className="mb-5">
                  <label className="text-muted form-label">
                    場地圖 <span className="text-danger">*</span>
                  </label>
                  <small className="text-muted d-block mb-2">請上傳圖片（JPG 或 PNG 格式），檔案大小需低於 5MB。</small>
                  <Controller
                    name="venueMapImage"
                    control={control}
                    rules={{
                      required: !isEditMode || (isEditMode && !venueMapPreview) ? "請上傳場地圖" : false,
                    }}
                    render={({ field: { onChange, onBlur, name, ref } }) => (
                      <>
                        <div
                          className={`bg-white border border-2 text-center ${
                            errors.venueMapImage ? "border-danger" : ""
                          }`}
                          style={{
                            borderStyle: "dashed",
                            borderRadius: "0.375rem",
                            cursor: "pointer",
                            minHeight: "240px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            overflow: "hidden",
                          }}
                          onClick={() => document.getElementById("venueMapImage_input").click()}
                          role="button"
                          tabIndex={0}
                          onKeyPress={(e) => {
                            if (e.key === "Enter" || e.key === " ")
                              document.getElementById("venueMapImage_input").click();
                          }}
                        >
                          {venueMapPreview ? (
                            <img
                              src={venueMapPreview}
                              alt="場地圖預覽"
                              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                            />
                          ) : (
                            <div style={{ position: "relative", maxWidth: "100%", maxHeight: "230px" }}>
                              <img
                                src={venuePreview}
                                alt="場地圖範例"
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: "230px",
                                  objectFit: "contain",
                                  opacity: 0.2,
                                }}
                              />
                              <div
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  textAlign: "center",
                                }}
                              >
                                <i className="bi bi-upload mb-3" style={{ fontSize: "2rem", color: "#6c757d" }}></i>
                                <p className="text-muted mb-0">請上傳場地圖片</p>
                              </div>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          id="venueMapImage_input"
                          style={{ display: "none" }}
                          accept="image/*"
                          name={name}
                          ref={ref}
                          onBlur={onBlur}
                          onChange={(e) => {
                            onChange(e.target.files);
                          }}
                        />
                      </>
                    )}
                  />
                  {errors.venueMapImage && (
                    <small className="text-danger mt-1 d-block">{errors.venueMapImage.message}</small>
                  )}
                </div>
              </div>
              {/* 10. 表演人員 */}
              <div className="mb-3">
                <label htmlFor="performers" className="text-muted form-label">
                  表演人員<span className="text-danger">*</span>
                </label>
                <textarea
                  className={`form-control ${errors.performers ? "is-invalid" : ""}`}
                  id="performers"
                  rows="3"
                  placeholder="請輸入表演人員名單"
                  {...register("performers", { required: "表演人員為必填" })}
                ></textarea>
                <div className="invalid-feedback">{errors.performers?.message}</div>
              </div>
              {/* 11. 活動介紹 */}
              <div className="mb-3">
                <label htmlFor="eventDescription" className="text-muted form-label">
                  活動介紹<span className="text-danger">*</span>
                </label>
                <Controller
                  name="eventDescription" // 對應到 useForm 中的欄位名稱
                  control={control}
                  rules={{
                    required: "活動介紹為必填",
                    validate: (value) =>
                      (value && value.replace(/<(.|\n)*?>/g, "").trim().length > 0) || "活動介紹為必填",
                  }}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value || ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      isInvalid={!!errors.eventDescription}
                      placeholder="請詳細介紹您的活動內容..."
                    />
                  )}
                />
                {errors.eventDescription && (
                  <small className="text-danger mt-1 d-block">{errors.eventDescription.message}</small>
                )}
              </div>
              {/* 12. 類型 (Radio buttons) */}
              <div className="my-3">
                <label className="text-muted form-label d-block">
                  類型 <span className="text-danger">*</span>
                </label>
                {eventTypesOri.map((type) => (
                  <div className="form-check form-check-inline" key={type.id}>
                    <input
                      className={`form-check-input ${errors.eventType ? "is-invalid" : ""}`}
                      type="radio"
                      name="eventType"
                      id={`eventType-${type.id}`}
                      value={type.id} // value 現在是 ID
                      {...register("eventType", { required: "請選擇一個活動類型" })}
                    />
                    <label className="form-check-label" htmlFor={`eventType-${type.id}`}>
                      {type.name}
                    </label>
                  </div>
                ))}
                {errors.eventType && <small className="text-danger mt-1 d-block">{errors.eventType.message}</small>}
              </div>
            </div>
          </div>
          {/* --- 分區設定區塊 --- */}
          <div className="d-flex justify-content-between align-items-center border-top border-bottom border-2 border-secondary my-5 py-3">
            <h2 className="h4">分區設定</h2>
            <button
              type="button"
              className="btn btn-danger btn-sm" // 設計稿上的紅色按鈕
              onClick={handleAddZone}
            >
              <i className="bi bi-plus-circle-fill me-1"></i>
              新增分區
            </button>
          </div>
          {/* 表頭 (如果分區存在) */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={zones.map((z) => z.id)} // 傳遞 ID 陣列
              strategy={verticalListSortingStrategy}
            >
              {/* 表頭 */}
              {zones.length > 0 && (
                <div className="row gx-2 gy-2 mb-4 text-muted small">
                  <div className="col-2 text-center">移動</div>
                  <div className="col-3">分區名稱</div>
                  <div className="col-3">票價</div>
                  <div className="col-2">票數</div>
                  <div className="col-2 text-center">移除</div>
                </div>
              )}
              {/* 分區列表 */}
              {zones.map((zone, index) => (
                <SortableZoneItem
                  key={zone.id}
                  id={zone.id}
                  zone={zone}
                  index={index}
                  handleZoneChange={handleZoneChange}
                  handleRemoveZone={handleRemoveZone}
                />
              ))}
            </SortableContext>
            {/* DragOverlay 可以讓拖曳的項目有更平滑的視覺效果，且可以自訂拖曳時的樣子 */}
            <DragOverlay>
              {activeDragId && activeZone ? (
                // 這裡渲染拖曳中的項目，可以複製 SortableZoneItem 的結構，但移除 listeners 和 attributes
                <div className="row gx-2 gy-3 align-items-center p-2 border rounded custom-drag-overlay-item shadow-lg">
                  {/* 簡單的預覽樣式 */}
                  <div className="col-1 text-center">
                    <i className="bi bi-grip-vertical" style={{ fontSize: "1.2rem" }}></i>
                  </div>
                  <div className="col-4">{activeZone.name}</div>
                  <div className="col-3">${activeZone.price}</div>
                  <div className="col-2">{activeZone.tickets}</div>
                  <div className="col-2 text-center">
                    <i className="bi bi-trash-fill text-danger"></i>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
          {zones.length === 0 && (
            <p className="text-muted text-center py-3">尚未新增任何分區，請點擊「新增分區」按鈕開始。</p>
          )}
          {/* --- 最後是操作按鈕 --- */}
          <div className="d-flex justify-content-end gap-3 mt-5 mb-4">
            {/* 新增的測試按鈕 */}
            <button type="button" className="btn btn-outline-secondary px-4 py-2" onClick={() => navigate("/events")}>
              取消
            </button>
            <button type="submit" className="btn btn-danger px-4 py-2">
              提交審核
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventFormPage;
