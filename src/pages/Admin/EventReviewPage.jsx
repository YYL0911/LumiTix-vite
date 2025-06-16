import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
// 元件
import Breadcrumb from "../../conponents/Breadcrumb";
import Loading from "../../conponents/Loading";
// 定義此頁面的麵包屑靜態結構
const breadcrumb = [{ name: "首頁", path: "/" }, { name: "活動管理", path: "/eventsList" }, { name: "活動審核" }];

const EventReviewPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { userToken } = useAuth();
  // --- state 來儲存 API 資料 ---
  const [eventData, setEventData] = useState(null);
  const [apiLoading, setApiLoading] = useState(true);
  // --- useEffect 來抓取活動詳情 ---
  useEffect(() => {
    if (!eventId || !userToken) {
      setApiLoading(false);
      return;
    }

    const fetchEventData = async () => {
      setApiLoading(true);
      try {
        const url = `https://n7-backend.onrender.com/api/v1/admin/events/${eventId}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        if (response.data.status) {
          setEventData(response.data.data);
        } else {
          throw new Error(response.data.message || "無法取得活動資料");
        }
      } catch (error) {
        console.error("獲取活動詳情失敗!", error.response || error);

        // 從 error 物件中，提取後端回傳的狀態碼和錯誤訊息
        const statusCode = error.response?.status;
        const errorMessage = error.response?.data?.message || "發生未知錯誤，請稍後再試。";

        // 狀況一：401 未授權 (Token 失效或未登入)
        if (statusCode === 401) {
          alert("您尚未登入或登入已逾時，請重新登入。");
          navigate("/login");
        }
        // 狀況二：403 禁止 (使用者沒有權限)
        else if (statusCode === 403) {
          alert("您沒有權限查看此活動詳情。");
          navigate("/eventsList");
        }
        // 狀況三：404 找不到 (活動不存在或已被刪除)
        else if (statusCode === 404) {
          alert("找不到此活動，它可能已被刪除。");
          navigate("/eventsList");
        }
        // 狀況四：其他所有錯誤 (例如 400, 500)
        else {
          alert(`載入資料時發生錯誤：\n${errorMessage}`);
          navigate("/eventsList");
        }
      } finally {
        setApiLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, userToken, navigate]);

  // --- 用於格式化日期的輔助函式 ---
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString.slice(0, -1)); // 後端回傳的格式是 'YYYY-MM-DD HH:mm'，可以直接給 new Date()
    if (isNaN(date)) return "無效日期"; // 增加保護
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const week = ["日", "一", "二", "三", "四", "五", "六"][date.getDay()];
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day}(${week}) ${hours}:${minutes}`;
  };

  // --- 審核操作邏輯 ---
  const handleReviewAction = async (isApproved) => {
    const actionText = isApproved ? "核准" : "拒絕";
    const confirmButtonColor = isApproved ? "#28a745" : "#dc3545"; // 核准用綠色，拒絕用紅色

    const result = await Swal.fire({
      title: `確定要 ${actionText} 活動嗎？`,
      text: `活動名稱：${eventData?.title}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: confirmButtonColor,
      cancelButtonColor: "#6c757d",
      confirmButtonText: `是的，${actionText}`,
      cancelButtonText: "取消",
    });

    // 如果使用者點擊了「確認」按鈕
    if (result.isConfirmed) {
      setApiLoading(true);
      try {
        const url = `https://n7-backend.onrender.com/api/v1/admin/events/${eventId}`;
        const body = { isApproved: isApproved };

        await axios.patch(url, body, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });

        // 用 Swal.fire 取代成功的 alert
        await Swal.fire({
          title: "操作成功！",
          text: `活動已成功 ${actionText}。`,
          icon: "success",
          timer: 1500, // 1.5秒後自動關閉
          showConfirmButton: false,
        });

        // 在 SweetAlert 成功提示框關閉後，才跳轉頁面
        navigate("/eventsList");
      } catch (error) {
        const errorMessage = error.response?.data?.message || "發生未知錯誤，請稍後再試。";
        console.error(`活動${actionText}失敗`, error.response || error);

        // 用 Swal.fire 取代失敗的 alert
        Swal.fire("操作失敗！", errorMessage, "error");
      } finally {
        setApiLoading(false);
      }
    }
  };

  if (apiLoading) {
    return <Loading />;
  }

  if (!eventData) {
    return (
      <div className="container py-3">
        <Breadcrumb breadcrumbs={breadcrumbStatic} />
        <div className="alert alert-warning text-center mt-4">查無此活動資料。</div>
      </div>
    );
  }

  return (
    <div className="container py-3 px-md-5">
      <Breadcrumb breadcrumbs={breadcrumb} />
      <div className="mt-3">
        {/* --- 3. JSX 中改為讀取 eventData state，並使用可選串聯 (?.) 避免錯誤 --- */}
        <div className="fs-5 border-bottom border-1 border-secondary">
          <div className="d-flex flex-column flex-md-row mb-3">
            <div className="text-nowrap text-muted me-md-3 mb-2 mb-md-0" style={{ width: "120px" }}>
              主辦方：
            </div>
            <div className="fw-bold flex-grow-1">{eventData.organizer}</div>
          </div>
          <div className="d-flex flex-column flex-md-row mb-3">
            <div className="text-nowrap text-muted me-md-3 mb-2 mb-md-0">活動封面照：</div>
            <div className="border border-2 border-secondary p-3 mb-4">
              <img src={eventData.cover_image_url} alt={eventData.title} className="img-fluid" />
            </div>
          </div>
          <div className="d-flex flex-column flex-md-row mb-3">
            <div className="text-nowrap text-muted me-md-3 mb-2 mb-md-0" style={{ width: "120px" }}>
              活動名稱：
            </div>
            <div className="fw-bold flex-grow-1">{eventData.title}</div>
          </div>
          <div className="d-flex flex-column flex-md-row mb-3">
            <div className="text-nowrap text-muted me-md-3 mb-2 mb-md-0" style={{ width: "120px" }}>
              活動地點：
            </div>
            <div className="fw-bold flex-grow-1">{eventData.location}</div>
          </div>
          <div className="d-flex flex-column flex-md-row mb-3">
            <div className="text-nowrap text-muted me-md-3 mb-2 mb-md-0" style={{ width: "120px" }}>
              地址：
            </div>
            <div className="fw-bold flex-grow-1">{eventData.address}</div>
          </div>
          <div className="d-flex flex-column flex-md-row mb-3">
            <div className=" text-nowrap text-muted me-md-3 mb-2 mb-md-0" style={{ width: "120px" }}>
              演出時間：
            </div>
            <div className="fw-bold flex-grow-1">
              {formatDateTime(eventData.start_at)}
              <span className="d-md-none">
                <br />
              </span>
              <span className="d-none d-md-inline"> ~ </span>
              {formatDateTime(eventData.end_at)}
            </div>
          </div>
          <div className="d-flex flex-column flex-md-row mb-3">
            <div className="text-nowrap text-muted me-md-3 mb-2 mb-md-0" style={{ width: "120px" }}>
              表演人員：
            </div>
            <div className="fw-bold flex-grow-1">{eventData.performance_group}</div>
          </div>
          <div className="d-flex flex-column flex-md-row mb-3">
            <div className="text-nowrap text-muted me-md-3 mb-2 mb-md-0" style={{ width: "120px" }}>
              售票時間：
            </div>
            <div className="fw-bold flex-grow-1">
              {formatDateTime(eventData.sale_start_at)}
              <span className="d-md-none">
                <br />
              </span>
              <span className="d-none d-md-inline"> ~ </span>
              {formatDateTime(eventData.sale_end_at)}
            </div>
          </div>
          <div className="d-flex flex-column flex-md-row mb-3">
            <div className="text-nowrap text-muted me-md-3 mb-2 mb-md-0" style={{ width: "120px" }}>
              類型：
            </div>
            <div className="fw-bold flex-grow-1">{eventData.type}</div>
          </div>
          <div className="d-flex flex-column flex-md-row mb-3">
            <div className="pe-2 text-nowrap text-muted me-md-3 mb-2 mb-md-0" style={{ width: "120px" }}>
              活動介紹：
            </div>
            <div className="fw-bold" style={{ whiteSpace: "pre-wrap" }}>
              {eventData.description}
            </div>
          </div>

          <div className="my-4">
            <p className="fs-5 text-muted mb-4">分區設定：</p>
            <div className="row g-4 justify-content-between align-items-start">
              <div className="col-12 col-lg-7">
                <img src={eventData.section_image_url} alt="場地圖" className="img-fluid border" />
              </div>
              <div className="col-12 col-lg-5">
                <div className="table-responsive">
                  <table className="table text-center align-middle table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>分區名稱</th>
                        <th>票價</th>
                        <th>人數上限</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventData.sections?.map((sec) => (
                        <tr key={sec.section_name}>
                          <td>{sec.section_name}</td>
                          <td>{(sec.price ?? 0).toLocaleString()}</td>
                          <td>{sec.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center gap-4 my-5">
        {/* 拒絕按鈕呼叫 handleReviewAction(false) */}
        <button className="btn btn-lg btn-danger" onClick={() => handleReviewAction(false)}>
          審核未通過
        </button>
        {/* 核准按鈕呼叫 handleReviewAction(true) */}
        <button className="btn btn-lg btn-success" onClick={() => handleReviewAction(true)}>
          審核通過
        </button>
      </div>
    </div>
  );
};

export default EventReviewPage;
