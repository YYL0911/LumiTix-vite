import { useState, useEffect, useRef } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";

import Breadcrumb from "../../conponents/Breadcrumb"; // 自訂組件，用於顯示麵包屑導航
import Loading from "../../conponents/Loading";// 自訂組件，用於顯示載入指示器
// 將日期格式化函式放在元件外部，因為它不依賴任何 props 或 state，可供重用
const formatDisplayTime = (dateString) => {
  if (!dateString) return "N/A";
  try {
    // new Date() 可以直接解析後端回傳的 UTC 時間字串，並自動轉換為瀏覽器的本地時區
    const date = new Date(dateString);
    // 使用 (eeeee) 來顯示中文單字的星期，例如 (一), (二)
    return format(date, "yyyy-MM-dd (eeeee) HH:mm", { locale: zhTW });
  } catch (e) {
    console.error("日期格式化失敗:", dateString, e);
    return "無效日期";
  }
};

const TicketDetailPage = () => {
  const { id: orderId } = useParams(); // 從當前 URL 獲取路徑參數 'id'，並將其重新命名為 'orderId'
  const { userToken } = useAuth(); // 從 AuthContext 中獲取使用者 token
  const navigate = useNavigate(); // 獲取 navigate 函數，用於頁面跳轉

  const [ticketData, setTicketData] = useState(null); // 儲存從 API 獲取到的完整訂單資料
  const [loading, setLoading] = useState(true); // 管理初次載入的狀態
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0); // 追蹤目前顯示的是第幾張票券
  const [errorMessage, setErrorMessage] = useState(""); // 儲存錯誤訊息

  // 建立一個 ref 來追蹤最新的 ticketData，它不會觸發 effect
  // 使用 useRef 來追蹤最新的 ticketData 和 currentTicketIndex，但它的變動「不會」觸發 useEffect 重新執行，從而避免無限迴圈
  const ticketDataRef = useRef(ticketData);
  const currentIndexRef = useRef(currentTicketIndex);
  // 建立一個簡短的 effect，專門用來將 state 的最新值同步到 ref 中
  useEffect(() => {
    ticketDataRef.current = ticketData;
    currentIndexRef.current = currentTicketIndex;
  }, [ticketData, currentTicketIndex]);

  useEffect(() => {
    // --- 前置檢查 ---
    if (!orderId || !userToken) {
      setLoading(false);
      setErrorMessage("無效的訂單ID或尚未登入");
      return;
    }

    let isMounted = true; // 標記元件是否仍掛載，用於防止在元件卸載後還更新狀態
    let intervalId = null; // 用於存放計時器的 ID，以便後續清除

    const fetchTicketDetails = async (isInitialFetch = false) => {
      // 只在初次載入時，才顯示全頁的 Loading 動畫
      if (isInitialFetch) setLoading(true);

      try {
        const response = await axios.get(`https://n7-backend.onrender.com/api/v1/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        if (!isMounted) return; // 如果在請求過程中元件被卸載，則直接返回

        if (response.data?.status) {
          const newApiData = response.data.data;

          setTicketData((prevData) => {
            // 如果是初次載入，或根本沒有舊資料，直接回傳新資料來更新畫面
            if (isInitialFetch || !prevData) {
              return newApiData;
            }
            // 比對新舊資料中，票券的狀態是否有任何不同
            const hasStatusChanged = newApiData.tickets.some(
              (newTicket, index) => prevData.tickets[index]?.status !== newTicket.status
            );
            // 如果狀態沒變，回傳舊的資料，React 會進行優化，不觸發不必要的畫面刷新
            if (!hasStatusChanged) {
              return prevData;
            }
            // 如果狀態改變了，執行「索引校正」邏輯，確保使用者看到的還是同一張票
            const currentTicketId = prevData.tickets[currentIndexRef.current]?.ticket_no;

            if (currentTicketId) {
              const newIndex = newApiData.tickets.findIndex((ticket) => ticket.ticket_no === currentTicketId);
              if (newIndex !== -1) {
                setCurrentTicketIndex(newIndex); // 更新當前票券的索引
              }
            }
            return newApiData; // 回傳新資料來更新畫面
          });
          // 檢查是否所有票券都已使用，如果是，則停止輪詢
          const allTicketsAreUsed = newApiData.tickets.every((ticket) => ticket.status === "used");
          if (allTicketsAreUsed) {
            clearInterval(intervalId);
          }
        } else {
          throw new Error(response.data?.message || "無法取得票券資訊");
        }
      } catch (error) {
        if (!isMounted) return;
        const message = error.response?.data?.message || "發生未知錯誤";
        setErrorMessage(message);
        console.error("Fetch Error:", error.response || error);
        clearInterval(intervalId); // 發生無法恢復的錯誤時，也停止輪詢
      } finally {
        if (isMounted && isInitialFetch) setLoading(false);
      }
    };

    fetchTicketDetails(true); // 立即執行第一次，顯示 Loading
    intervalId = setInterval(() => fetchTicketDetails(false), 5000); // 設定每 5 秒在背景輪詢
    // 當元件卸載 (例如使用者跳到其他頁面) 時執行
    return () => {
      isMounted = false; // 將標記設為 false
      clearInterval(intervalId); // 清除計時器，避免記憶體洩漏
    };
  }, [orderId, userToken, navigate]);

  const handlePrevTicket = () => {
    setCurrentTicketIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextTicket = () => {
    if (ticketData && currentTicketIndex < ticketData.tickets.length - 1) {
      setCurrentTicketIndex((prev) => prev + 1);
    }
  };

  if (loading) return <Loading />;
  // 根據載入後的資料，動態產生麵包屑
  const breadcrumb = [
    { name: "首頁", path: "/" },
    { name: "票務管理", path: "/tickets" },
    { name: ticketData?.event.title || "票券詳情" },
  ];

  if (errorMessage || !ticketData || !ticketData.tickets || ticketData.tickets.length === 0) {
    return (
      <div className="container py-3 text-center">
        <Breadcrumb breadcrumbs={breadcrumb} />
        <div className="alert alert-warning mt-4" role="alert">
          <h4>{errorMessage ? "載入失敗" : "查無票券資料"}</h4>
          {errorMessage && <p>{errorMessage}</p>}
        </div>
        <button onClick={() => navigate("/tickets")} className="btn btn-primary mt-2">
          返回票務管理
        </button>
      </div>
    );
  }

  const currentTicket = ticketData.tickets[currentTicketIndex];

  return (
    <div className="container py-3">
      <Breadcrumb breadcrumbs={breadcrumb} />
      <div className="card mb-4 shadow-sm">
        {/* --- JSX 直接讀取 API 回傳的原始資料結構 --- */}
        <div className="text-center bg-light py-3">
          <img
            src={ticketData.event.cover_image_url || "..."}
            alt="活動封面"
            className="img-fluid"
            style={{ maxHeight: "300px", objectFit: "contain" }}
          />
        </div>
        <div className="card-body text-center">
          <div className="d-inline-block p-2 rounded mb-2" style={{ backgroundColor: "#D1FAE5" }}>
            <img
              src={currentTicket.qrcode_image || "..."}
              alt="入場 QRCODE"
              style={{ width: "250px", height: "250px" }}
            />
          </div>
          <p className="mb-2 text-muted">
            入場QRCODE
            <span
              className={`badge fs-6 ${currentTicket.status === "used" ? "bg-secondary" : "bg-danger bg-gradient"}`}
            >
              {currentTicket.status === "used" ? "已使用" : "未使用"}
            </span>
          </p>
          <p className="mb-1">訂單編號：{ticketData.order_no}</p>
          <p className="mb-3 text-muted small">票券編號：{currentTicket.ticket_no}</p>

          <div className="row border-top border-bottom py-3 mx-1 text-center fs-5">
            <div className="col-4">
              <small className="text-muted d-block fs-6">票種</small>
              <div>{currentTicket.type}</div>
            </div>
            <div className="col-4 border-start border-end">
              <small className="text-muted d-block fs-6">票價</small>
              <div>{(currentTicket.price ?? 0).toLocaleString()} TWD</div>
            </div>
            <div className="col-4">
              <small className="text-muted d-block fs-6">座位</small>
              <div>{currentTicket.seat_no}</div>
            </div>
          </div>

          {ticketData.tickets.length > 1 && (
            <div className="d-flex justify-content-center align-items-center mt-3 px-3">
              <button
                className="btn btn-lg btn-link text-secondary px-4"
                onClick={handlePrevTicket}
                disabled={currentTicketIndex === 0}
                aria-label="上一張"
              >
                <i className="bi bi-arrow-left-circle fs-1"></i>
              </button>
              <span className="fs-5">
                第 {currentTicketIndex + 1} / {ticketData.tickets.length} 張
              </span>
              <button
                className="btn btn-lg btn-link text-secondary px-4"
                onClick={handleNextTicket}
                disabled={currentTicketIndex === ticketData.tickets.length - 1}
                aria-label="下一張"
              >
                <i className="bi bi-arrow-right-circle fs-1"></i>
              </button>
            </div>
          )}
        </div>
      </div>
      <h5 className="mb-3 text-start">詳細資訊</h5>
      <div className="card">
        <div className="card-body py-2 px-3">
          <div className="mb-3 d-flex flex-column border-bottom py-2">
            <span className="text-muted">訂單編號</span>
            <span>{ticketData.order_no}</span>
          </div>
          <div className="mb-3 d-flex flex-column border-bottom py-2">
            <span className="text-muted">活動名稱</span>
            <span>{ticketData.event.title}</span>
          </div>
          <div className="mb-3 d-flex flex-column border-bottom py-2">
            <span className="text-muted">活動時間</span>
            <span>{`${formatDisplayTime(ticketData.event.start_at)} ~ ${formatDisplayTime(
              ticketData.event.end_at
            )}`}</span>
          </div>
          <div className="mb-3 d-flex flex-column border-bottom py-2">
            <span className="text-muted">活動地點</span>
            <span>{`${ticketData.event.location} (${ticketData.event.address})`}</span>
          </div>
          <div className="mt-4 mb-2">
            <p className="mb-3 text-muted">參加者資訊</p>
            <div className="mb-3 d-flex flex-column border-bottom py-2">
              <span className="text-muted">姓名</span>
              <span>{ticketData.user.name}</span>
            </div>
            <div className="mb-2 d-flex flex-column py-2">
              <span className="text-muted">電子郵件</span>
              <span>{ticketData.user.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
