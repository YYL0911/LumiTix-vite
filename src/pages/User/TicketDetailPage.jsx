// 1. 從 React 和其他函式庫/組件導入必要的模組
import { useState, useEffect } from "react"; // React 核心鉤子 (hooks)，用於狀態 (state) 和副作用 (side effects)
import { useParams, useNavigate } from "react-router-dom"; // React Router 鉤子，分別用於獲取 URL 參數和進行程式化導航
import { useAuth } from "../../contexts/AuthContext"; // 自訂鉤子，用於從身份驗證上下文中獲取認證相關資訊 (例如 userToken)
import axios from "axios"; // 用於發送 HTTP 請求的函式庫
import { format, parseISO } from "date-fns"; // 導入 date-fns 的 format 和 parseISO
import Breadcrumb from "../../conponents/Breadcrumb"; // 自訂組件，用於顯示麵包屑導航
import Loading from "../../conponents/Loading"; // 自訂組件，用於顯示載入指示器

// 2. 定義此頁面的麵包屑靜態結構
const breadcrumb = [
  { name: "首頁", path: "/" }, // 第一層：首頁，並指定路徑
  { name: "票務管理", path: "/tickets" }, // 第二層：票務管理頁面，並指定路徑
  { name: "票券詳情" }, // 第三層：目前頁面名稱 (票券詳情)，通常最後一層不設路徑
];

// 3. 定義主要的函數式組件：TicketDetailPage
// 此組件負責顯示單張票券的詳細資訊
const TicketDetailPage = () => {
  // 4. 鉤子 (Hooks) 和狀態 (State) 初始化
  const { id: orderId } = useParams(); // 從當前 URL 獲取路徑參數 'id'，並將其重新命名為 'orderId' 以增加可讀性
  const { userToken } = useAuth(); // 從 AuthContext 中獲取使用者登入後產生的 token
  const navigate = useNavigate(); // 獲取 navigate 函數，用於在程式邏輯中跳轉頁面

  // --- 狀態變數定義 ---
  // ticketData: 用於儲存從 API 獲取到的票券詳細資料，初始值為 null
  const [ticketData, setTicketData] = useState(null);
  // loading: 布林值，用於管理資料是否正在載入中，預設為 true (一進入頁面就開始載入)
  const [loading, setLoading] = useState(true);
  // currentTicketIndex: 數字，當一個訂單包含多張票券時，用於追蹤目前顯示的是第幾張票券 (基於 0 的索引)，預設為 0
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);
  // errorMessage: 字串，用於儲存載入資料過程中發生的錯誤訊息，初始為空字串
  const [errorMessage, setErrorMessage] = useState("");

  // 5. useEffect 鉤子用於資料獲取等副作用操作
  // 當 orderId, userToken, 或 navigate 函數發生變化時，此 effect 會重新執行
  useEffect(() => {
    // --- 前置檢查 ---
    // 如果 orderId 不存在 (例如 URL 不正確)，則設定錯誤訊息並停止後續操作
    if (!orderId) {
      setLoading(false); // 停止載入狀態
      setErrorMessage("無效的訂單ID");
      return; // 結束 effect 執行
    }

    // 如果 userToken 不存在 (使用者未登入)，則設定錯誤訊息並導向到登入頁面
    if (!userToken) {
      setLoading(false); // 停止載入狀態
      setErrorMessage("請先登入"); // 雖然會馬上導航，但還是可以設定一下
      navigate("/login"); // 導向登入頁
      return; // 結束 effect 執行
    }

    // --- 定義異步函數以獲取票券詳細資料 ---
    const fetchTicketDetails = async () => {
      setLoading(true); // 開始載入，設定載入狀態為 true
      setErrorMessage(""); // 清除任何先前的錯誤訊息

      try {
        // 使用 axios 發送 GET 請求到後端 API
        const response = await axios.get(`https://n7-backend.onrender.com/api/v1/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`, // 在請求標頭中加入 Bearer Token 進行身份驗證
          },
        });

        // --- 處理 API 成功回應 ---
        if (response.data && response.data.status === true) {
          const apiData = response.data.data; // 從回應中取出實際的資料部分
          // --- 時間格式化處理 (使用 date-fns) ---
          let formattedStartTime = "N/A";
          if (apiData.event.start_at) {
            // 確保 API 有回傳 start_at
            try {
              let isoString = apiData.event.start_at;
              // 檢查是否為字串且以 'Z' 結尾
              if (typeof isoString === "string" && isoString.endsWith("Z")) {
                isoString = isoString.slice(0, -1); // 移除 'Z'
              }
              // parseISO 現在會將（可能已修改的）isoString 解讀為本地時間
              const startDate = parseISO(isoString);
              formattedStartTime = format(startDate, "yyyy-MM-dd HH:mm");
            } catch (e) {
              console.error("Error formatting start_at:", apiData.event.start_at, e);
              // 解析失敗的備援機制，盡可能接近原始的簡易格式化方式
              if (typeof apiData.event.start_at === "string") {
                formattedStartTime = apiData.event.start_at.replace("T", " ").substring(0, 16);
              } else {
                formattedStartTime = "無效日期";
              }
            }
          }
          let formattedEndTime = "N/A";
          if (apiData.event.end_at) {
            // 確保 API 有回傳 end_at
            try {
              let isoString = apiData.event.end_at;
              if (typeof isoString === "string" && isoString.endsWith("Z")) {
                isoString = isoString.slice(0, -1); // 移除 'Z'
              }
              const endDate = parseISO(isoString);
              formattedEndTime = format(endDate, "HH:mm");
            } catch (e) {
              console.error("Error formatting end_at:", apiData.event.end_at, e);
              if (typeof apiData.event.end_at === "string") {
                formattedEndTime = apiData.event.end_at.replace("T", " ").substring(11, 16);
              } else {
                formattedEndTime = "無效時間";
              }
            }
          }
          // --- 資料轉換 ---
          // 將從 API 獲取的資料 (apiData) 轉換為前端組件更容易使用的結構 (transformedData)
          const transformedData = {
            coverImage: apiData.event.cover_image_url, // 活動封面圖片 URL
            ticketNumberMaster: apiData.order_no, // 主訂單編號
            tickets: apiData.tickets.map((ticket) => ({
              // 遍歷訂單中的每張票券
              id: ticket.ticket_no, // 每張票的獨立票號
              type: ticket.type, // 票種 (例如：全票)
              price: `${ticket.price} TWD`, // 票價，並加上貨幣單位
              seat: ticket.seat_no, // 座位資訊
              status: ticket.status, // 票券狀態 (例如：unused, used)
              qrcode: ticket.qrcode_image, // 每張票獨立的 QR Code 圖片資料 (Base64)
            })),
            orderDetails: {
              // 訂單相關的詳細資訊
              orderNumber: apiData.order_no, // 訂單編號 (同 ticketNumberMaster)
              activityName: apiData.event.title, // 活動名稱
              activityTime: `${formattedStartTime} ~ ${formattedEndTime}`, // 格式化後的活動時間區間
              activityLocation: apiData.event.location, // 活動地點
              activityAddress: apiData.event.address, // 活動詳細地址
            },
            participantInfo: {
              // 參加者/購買者資訊
              name: apiData.user.name, // 姓名
              email: apiData.user.email, // 電子郵件
            },
          };
          setTicketData(transformedData); // 更新 ticketData 狀態，觸發組件重新渲染以顯示資料
        } else {
          // --- 處理 API 回應但 status 為 false 的情況 (例如：後端邏輯錯誤) ---
          const message = response.data?.message || "無法取得票券資訊"; // 從回應中獲取錯誤訊息，或使用預設訊息
          setErrorMessage(message); // 設定錯誤訊息狀態
          console.error("API Error:", message); // 在主控台印出 API 錯誤
          // 如果是特定錯誤 (訂單不存在、權限不足)，延遲後導回票券列表頁
          if (message === "訂單不存在" || message === "使用者權限不足") {
            setTimeout(() => navigate("/tickets"), 3000); // 3秒後導航
          }
        }
      } catch (error) {
        // --- 處理請求過程中的其他錯誤 (例如：網路問題、伺服器 500 錯誤等) ---
        console.error("Fetch Ticket Details Error:", error); // 在主控台印出捕獲到的錯誤對象
        let message = "發生未知錯誤"; // 預設錯誤訊息
        if (error.response) {
          // 如果錯誤包含 response 物件，表示是伺服器回傳的 HTTP 錯誤 (4xx, 5xx)
          message = error.response.data?.message || `錯誤碼：${error.response.status}`; // 優先使用後端提供的錯誤訊息
          // 如果是 401 未授權或特定訊息 "尚未登入"，導向登入頁
          if (error.response.status === 401 || error.response.data?.message === "尚未登入") {
            navigate("/login");
            return; // 結束函式執行，避免後續的 setLoading(false) 被錯誤地調用
          }
          // 如果是 403 權限不足、404 找不到或訊息為 "訂單不存在"，延遲後導回票券列表
          if (
            error.response.status === 403 ||
            error.response.status === 404 ||
            error.response.data?.message === "訂單不存在"
          ) {
            setTimeout(() => navigate("/tickets"), 3000);
          }
        } else if (error.request) {
          // 如果錯誤包含 request 物件但沒有 response，表示請求已發出但未收到回應 (例如網路斷線)
          message = "無法連接到伺服器，請檢查您的網路連線";
        }
        // 其他 setup 錯誤 (例如請求配置錯誤) 會使用預設的 "發生未知錯誤"
        setErrorMessage(message); // 設定錯誤訊息狀態
      } finally {
        // --- 無論成功或失敗，最後都會執行的區塊 ---
        setLoading(false); // 設定載入狀態為 false，表示資料獲取流程結束
      }
    };

    fetchTicketDetails(); // 呼叫異步函數開始獲取資料
  }, [orderId, userToken, navigate]); // useEffect 的依賴陣列：當這些值改變時，effect 會重新執行

  // 6. 票券導覽的事件處理函數 (用於多張票券時切換上一張)
  const handlePrevTicket = () => {
    // 更新 currentTicketIndex，使其減 1，但最小不小於 0
    setCurrentTicketIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  // 票券導覽的事件處理函數 (用於多張票券時切換下一張)
  const handleNextTicket = () => {
    // 確保 ticketData 存在且目前不是最後一張票
    if (ticketData && currentTicketIndex < ticketData.tickets.length - 1) {
      // 更新 currentTicketIndex，使其加 1
      setCurrentTicketIndex((prev) => prev + 1);
    }
  };

  // 7. 條件渲染：根據載入狀態或錯誤訊息顯示不同內容
  // 如果正在載入中，顯示 Loading 組件
  if (loading) return <Loading />;

  // 如果有錯誤訊息，顯示錯誤提示區塊
  if (errorMessage) {
    return (
      <div className="container py-3 text-center">
        {/* 麵包屑，標題顯示錯誤狀態 */}
        <Breadcrumb
          breadcrumbs={breadcrumb.map((b) => (b.name === "票券詳情" ? { ...b, name: `票券詳情 - 錯誤` } : b))}
        />
        <div className="alert alert-danger mt-4" role="alert">
          <h4>載入失敗</h4>
          <p>{errorMessage}</p>
          <button onClick={() => navigate("/tickets")} className="btn btn-primary">
            返回票務管理
          </button>
        </div>
      </div>
    );
  }

  // 如果沒有載入錯誤，但 ticketData 仍為 null (例如 API 回應異常但未被 catch 捕獲為 error，或資料為空)
  // 則顯示查無票券資料的提示
  if (!ticketData)
    return (
      <div className="container py-3 text-center">
        {/* 麵包屑，標題顯示查無資料狀態 */}
        <Breadcrumb
          breadcrumbs={breadcrumb.map((b) => (b.name === "票券詳情" ? { ...b, name: `票券詳情 - 查無資料` } : b))}
        />
        <div className="alert alert-warning mt-4" role="alert">
          查無票券資料。
        </div>
        <button onClick={() => navigate("/tickets")} className="btn btn-primary">
          返回票務管理
        </button>
      </div>
    );

  // 8. 為渲染準備資料：從 ticketData 中獲取當前選定要顯示的票券
  const currentTicket = ticketData.tickets[currentTicketIndex];

  // 9. JSX 用於渲染組件的 UI 介面 (當資料成功載入且無錯誤時)
  return (
    <div className="container py-3">
      {/* 主要容器，帶有垂直內邊距 */}
      {/* 麵包屑組件，動態顯示活動名稱作為票券詳情頁的標題 */}
      <Breadcrumb
        breadcrumbs={breadcrumb.map((b) =>
          b.name === "票券詳情" ? { ...b, name: `票券詳情 - ${ticketData.orderDetails.activityName}` } : b
        )}
      />
      {/* 主要票券資訊卡片 */}
      <div className="card mb-4 shadow-sm">
        {/* 活動封面圖片區塊 */}
        <div className="text-center bg-light py-3">
          <img
            src={ticketData.coverImage || "https://placehold.co/600x250/6c757d/white?text=無封面圖片"} // 活動封面圖，若無則顯示預設圖
            alt="活動封面" // 圖片的替代文字描述
            className="img-fluid" // Bootstrap class，使圖片自適應寬度
            style={{ maxHeight: "600px", objectFit: "contain" }} // 限制最大高度並確保圖片內容完整顯示
            onError={(e) => {
              // 圖片載入失敗時的處理
              e.target.onerror = null; // 防止無限迴圈 (如果備用圖片也失敗)
              e.target.src = "https://placehold.co/600x250/6c757d/white?text=圖片載入失敗"; // 顯示載入失敗的備用圖
            }}
          />
        </div>

        {/* 卡片內容區域 */}
        <div className="card-body text-center">
          {/* QR Code 顯示區塊 */}
          <div className="d-inline-block p-2 rounded mb-2" style={{ backgroundColor: "#D1FAE5" }}>
            {/* QR Code 的樣式化容器 */}
            <img
              src={currentTicket.qrcode || "https://placehold.co/120x120/e0f2e9/198754?text=無QR"} // 當前票券的 QR Code，若無則顯示預設圖
              alt="入場 QRCODE" // 圖片的替代文字描述
              style={{ width: "300px", height: "300px" }} // 設定 QR Code 圖片大小
              onError={(e) => {
                // QR Code 圖片載入失敗時的處理
                e.target.onerror = null;
                e.target.src = "https://placehold.co/120x120/e0f2e9/198754?text=QR失效"; // 顯示載入失敗的備用圖
              }}
            />
          </div>
          {/* QR Code 下方文字及票券狀態 */}
          <p className="mb-2 text-muted" style={{ fontSize: "1rem" }}>
            入場QRCODE ({currentTicket.status === "used" ? "已使用" : "未使用"}) {/* 根據票券狀態顯示文字 */}
          </p>
          {/* 訂單編號和票券編號 */}
          <p className="mb-1" style={{ fontSize: "1rem" }}>
            訂單編號：{ticketData.ticketNumberMaster}
          </p>
          <p className="mb-3" style={{ fontSize: "0.9rem", color: "#6c757d" }}>
            票券編號：{currentTicket.id} {/* 顯示當前單張票券的編號 */}
          </p>

          {/* 票種、票價、座位資訊 (格線系統排列) */}
          <div className="row border-top border-bottom py-3 mx-1 text-center" style={{ fontSize: "1.5rem" }}>
            <div className="col-4">
              {/* 票種 */}
              <div className="text-muted" style={{ fontSize: "1rem" }}>
                票種
              </div>
              <div>{currentTicket.type}</div>
            </div>
            <div className="col-4 border-start border-end">
              {/* 票價 */}
              <div className="text-muted" style={{ fontSize: "1rem" }}>
                票價
              </div>
              <div>{currentTicket.price}</div>
            </div>
            <div className="col-4">
              {/* 座位 */}
              <div className="text-muted" style={{ fontSize: "1rem" }}>
                座位
              </div>
              <div>{currentTicket.seat}</div>
            </div>
          </div>

          {/* 多張票券的導覽控制按鈕 (僅當訂單中票券數量大於1時顯示) */}
          {ticketData.tickets.length > 1 && (
            <div className="d-flex justify-content-center align-items-center mt-3 px-3">
              {/* 上一張票按鈕 */}
              <button
                className="btn btn-lg btn-link text-secondary px-4"
                onClick={handlePrevTicket} // 點擊時觸發切換到上一張票的函數
                disabled={currentTicketIndex === 0} // 如果是第一張票，則禁用此按鈕
                aria-label="上一張" // 無障礙標籤
              >
                <i className="bi bi-arrow-left-circle fs-1"></i> {/* Bootstrap Icon: 左箭頭 */}
              </button>
              {/* 顯示目前是第幾張/總共幾張 */}
              <span style={{ fontSize: "1.5rem" }}>
                第 {currentTicketIndex + 1} / {ticketData.tickets.length} 張
              </span>
              {/* 下一張票按鈕 */}
              <button
                className="btn btn-lg btn-link text-secondary px-4"
                onClick={handleNextTicket} // 點擊時觸發切換到下一張票的函數
                disabled={currentTicketIndex === ticketData.tickets.length - 1} // 如果是最後一張票，則禁用此按鈕
                aria-label="下一張" // 無障礙標籤
              >
                <i className="bi bi-arrow-right-circle fs-1"></i> {/* Bootstrap Icon: 右箭頭 */}
              </button>
            </div>
          )}
        </div>
      </div>
      {/* 詳細資訊區塊標題 */}
      <h6 className="card-title mb-3 text-start" style={{ fontSize: "1.5rem" }}>
        詳細資訊
      </h6>
      {/* 包含訂單和參與者詳細資訊的卡片 */}
      <div className="card">
        <div className="card-body py-2 px-3">
          {/* 訂單詳細資訊 */}
          <div className="mb-3 d-flex flex-column border-bottom pb-2">
            <span className="text-muted">訂單編號</span>
            <span>{ticketData.orderDetails.orderNumber}</span>
          </div>
          <div className="mb-3 d-flex flex-column border-bottom pb-2">
            <span className="text-muted">活動名稱</span>
            <span>{ticketData.orderDetails.activityName}</span>
          </div>
          <div className="mb-3 d-flex flex-column border-bottom pb-2">
            <span className="text-muted">活動時間</span>
            <span>{ticketData.orderDetails.activityTime}</span>
          </div>
          <div className="mb-3 d-flex flex-column border-bottom pb-2">
            <span className="text-muted">活動地點</span>
            <span>
              {/* 顯示地點和地址 */}
              {ticketData.orderDetails.activityLocation} ({ticketData.orderDetails.activityAddress})
            </span>
          </div>

          {/* 參與者資訊 */}
          <div className="mt-4 mb-2">
            <p className="mb-3 text-muted">參加者資訊</p>
            <div className="mb-3 d-flex flex-column border-bottom pb-2">
              <span className="text-muted">姓名</span>
              <span>{ticketData.participantInfo.name}</span>
            </div>
            <div className="mb-3 d-flex flex-column">
              {/* 最後一項資訊，通常不需要底線 */}
              {/* 這個空字串 " " 可能是為了格式或某些特殊渲染目的，可以檢查是否必要 */}
              <span className="text-muted">電子郵件</span>
              <span>{ticketData.participantInfo.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 導出主組件，使其可以在其他地方被引入和使用
export default TicketDetailPage;
