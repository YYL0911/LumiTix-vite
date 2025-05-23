// 1. 從 React 和其他函式庫/組件導入必要的模組
import { useState, useEffect } from "react"; // React 核心鉤子 (hooks)，用於狀態 (state) 和副作用 (side effects)
import { useParams } from "react-router-dom"; // 鉤子，用於存取 URL 參數 (例如 /tickets/TICKET_ID)
import { useNavigate } from "react-router-dom"; // 鉤子，用於程式化導航 (已導入但在此特定程式碼中未使用)
import { useAuth } from "../../contexts/AuthContext"; // 自訂鉤子，用於身份驗證上下文 (已導入但在此特定程式碼中未使用)
import axios from "axios"; // 匯入 axios（放在第三方套件區）
import Breadcrumb from "../../conponents/Breadcrumb"; // 自訂組件，用於顯示麵包屑導航
import Loading from "../../conponents/Loading"; // 自訂組件，用於顯示載入指示器

// 2. 定義此頁面的麵包屑結構
const breadcrumb = [
  { name: "首頁", path: "/" }, // 首頁
  { name: "票務管理", path: "/tickets" }, // 票務管理頁面
  { name: "票卷詳情", path: "/ticketInfo" }, // 目前頁面：票券詳情
];

// 3. 定義主要的函數式組件：TicketDetailPage
const TicketDetailPage = () => {
  // 4. 鉤子 (Hooks) 和狀態 (State) 初始化
  const { id } = useParams(); // 從當前 URL 獲取 'id' 參數 (例如，若 URL 為 /ticketInfo/123，則 id 為 "123")
  // 雖然提取了 'id'，但在下面的模擬資料獲取邏輯中並未直接使用它來改變資料。
  // 在實際應用中，這個 'id' 會被用來獲取特定的票券資料。

  const [ticketData, setTicketData] = useState(null); // 狀態，用於儲存獲取到的票券資料。初始值為 null。
  const [loading, setLoading] = useState(true); // 狀態，用於管理載入狀態。預設為 true。
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0); // 狀態，用於追蹤當訂單中有多張票券時，目前顯示的是哪一張。

  // 5. useEffect 鉤子用於資料獲取 (模擬)
  useEffect(() => {
    setLoading(true); // 當 effect 執行時 (例如組件掛載或 'id' 改變時) 將載入狀態設為 true

    // 使用 setTimeout 模擬 API 呼叫
    const timer = setTimeout(() => {
      // 添加 timer 以便在組件卸載時清除
      // 模擬票券資料。在實際應用中，這些資料會透過 'id' 從 API 獲取。
      setTicketData({
        coverImage: "https://placehold.co/600x250/6c757d/white?text=活動封面照", // 活動封面圖片 URL
        qrCodeImage: "https://placehold.co/120x120/e0f2e9/198754?text=", // QR code 圖片 URL (文字為空，可能顯示預設的佔位 QR code)
        ticketNumberMaster: "112255688", // 訂單的主票券編號
        tickets: [
          // 此訂單中包含的多張獨立票券陣列
          {
            id: "TICKET_001",
            type: "全票", // 票券類型 (例如：成人票)
            price: "1500 TWD", // 票價
            seat: "C區 2-F號", // 座位資訊 (標註為暫定)
          },
          {
            id: "TICKET_002",
            type: "全票",
            price: "1200 TWD",
            seat: "D區 1-A號",
          },
        ],
        orderDetails: {
          // 關於訂單本身的詳細資訊
          orderNumber: "223345678",
          activityName: "台北愛樂《春之頌》交響音樂會", // 活動名稱
          activityTime: "2025-05-05（三）18:00~21:00", // 活動時間
          activityLocation: "臺北國家音樂廳", // 活動地點
        },
        participantInfo: {
          // 關於持票人/購買者的資訊
          name: "王小明",
          email: "wang123@gmail.com",
        },
      });
      setLoading(false); // 資料 "獲取" 完成後將載入狀態設為 false
    }, 1000); // 模擬 1 秒的延遲

    // 清理函數：如果組件卸載或 'id' 在 setTimeout 完成前改變，則清除 setTimeout。
    return () => clearTimeout(timer);
  }, [id]); // 依賴陣列：此 effect 會在組件掛載時以及 'id' 參數改變時執行。

  // 6. 票券導覽的事件處理函數
  const handlePrevTicket = () => {
    // 將 currentTicketIndex 減 1，但不小於 0
    setCurrentTicketIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNextTicket = () => {
    // 將 currentTicketIndex 加 1，但不超過最後一張票券的索引
    if (ticketData && currentTicketIndex < ticketData.tickets.length - 1) {
      setCurrentTicketIndex((prev) => prev + 1);
    }
  };

  // 7. 載入狀態的條件渲染
  // 如果仍在載入中或 ticketData 為 null (例如獲取失敗或尚未完成)，則顯示 Loading 組件。
  if (loading || !ticketData) return <Loading />;

  // 8. 為渲染準備資料
  // 從 tickets 陣列中獲取當前選定票券的詳細資訊
  const currentTicket = ticketData.tickets[currentTicketIndex];

  // 9. JSX 用於渲染組件的 UI 介面
  return (
    <div className="container py-3">
      {/* 主要容器，帶有垂直方向的 padding */}
      <Breadcrumb breadcrumbs={breadcrumb} /> {/* 顯示麵包屑 */}
      {/* 主要票券資訊卡片 (QR code、座位等) */}
      <div className="card mb-4 shadow-sm">
        {/* 活動封面圖片區塊 */}
        <div className="text-center bg-light py-3">
          <img
            src={ticketData.coverImage}
            alt="活動封面" // 無障礙文字描述："Event Cover"
            className="img-fluid" // Bootstrap class，使圖片自適應
            style={{ maxHeight: "150px", objectFit: "contain" }} // 樣式，限制最大高度並確保圖片內容完整顯示
            onError={(e) => {
              // 若圖片載入失敗時的備用處理
              e.target.onerror = null; // 防止無限迴圈 (如果備用圖片也失敗)
              e.target.src = "https://placehold.co/600x250/6c757d/white?text=圖片載入失敗"; // 備用圖片："Image load failed"
            }}
          />
        </div>

        {/* 卡片內容：QR Code、主票號、單張票券詳情 */}
        <div className="card-body text-center">
          {/* QR Code 顯示 */}
          <div className="d-inline-block p-2 rounded mb-2" style={{ backgroundColor: "#D1FAE5" }}>
            {/* QR Code 的樣式化容器 */}
            <img
              src={ticketData.qrCodeImage}
              alt="入場 QRCODE" // 無障礙文字描述："Entry QRCODE"
              style={{ width: "100px", height: "100px" }} // 固定 QR Code 大小
              onError={(e) => {
                // QR Code 圖片載入失敗時的備用處理
                e.target.onerror = null;
                e.target.src = "https://placehold.co/120x120/e0f2e9/198754?text=QR"; // 備用 QR Code 圖片
              }}
            />
          </div>
          <p className="mb-2 text-muted" style={{ fontSize: "1rem" }}>
            入場QRCODE {/* 標籤："Entry QRCODE" */}
          </p>
          <p className="mb-3" style={{ fontSize: "1rem" }}>
            票券編號：{ticketData.ticketNumberMaster} {/* 主票券編號，標籤："Ticket Number:" */}
          </p>

          {/* 單張票券詳情：票種、票價、座位 */}
          <div className="row border-top border-bottom py-3 mx-1 text-center" style={{ fontSize: "1.5rem" }}>
            <div className="col-4">
              <div className="text-muted" style={{ fontSize: "1rem" }}>
                票種
              </div>
              {/* 標籤："Type" */}
              <div>{currentTicket.type}</div>
            </div>
            <div className="col-4 border-start border-end">
              <div className="text-muted" style={{ fontSize: "1rem" }}>
                票價
              </div>
              {/* 標籤："Price" */}
              <div>{currentTicket.price}</div>
            </div>
            <div className="col-4">
              <div className="text-muted" style={{ fontSize: "1rem" }}>
                座位
              </div>
              {/* 標籤："Seat" */}
              <div>{currentTicket.seat}</div>
            </div>
          </div>

          {/* 多張票券的導覽控制 */}
          <div className="d-flex justify-content-center align-items-center mt-3 px-3">
            <button
              className="btn btn-lg btn-link text-secondary px-4"
              onClick={handlePrevTicket}
              disabled={currentTicketIndex === 0 || ticketData.tickets.length <= 1} // 若是第一張票或只有一張票則禁用
              aria-label="上一張" // Aria 標籤："Previous Ticket"
            >
              <i class="bi bi-arrow-left-circle fs-1"></i> {/*表示上一張 */}
            </button>
            <span style={{ fontSize: "1.5rem" }}>
              第 {currentTicketIndex + 1} / {ticketData.tickets.length} 張 {/* 顯示目前第幾張/總共幾張 */}
            </span>
            <button
              className="btn btn-lg btn-link text-secondary px-4"
              onClick={handleNextTicket}
              disabled={currentTicketIndex === ticketData.tickets.length - 1 || ticketData.tickets.length <= 1} // 若是最後一張票或只有一張票則禁用
              aria-label="下一張" // Aria 標籤："Next Ticket"
            >
              <i class="bi bi-arrow-right-circle fs-1"></i>
              {/*表示下一張 */}
            </button>
          </div>
        </div>
      </div>
      {/* 詳細資訊區塊標題 */}
      <h6 className="card-title mb-3 text-start" style={{ fontSize: "1.5rem" }}>
        詳細資訊 {/* 標題："Detailed Information" */}
      </h6>
      {/* 額外訂單和參與者詳細資訊的卡片 */}
      <div className="card">
        <div className="card-body py-2 px-3">
          <div className="mb-3 d-flex flex-column  border-bottom pb-2">
            <span className="text-muted">訂單編號</span>
            <span>{ticketData.orderDetails.orderNumber}</span>
          </div>
          <div className="mb-3 d-flex flex-column  border-bottom pb-2">
            <span className="text-muted">活動名稱</span>
            <span>{ticketData.orderDetails.activityName}</span>
          </div>
          <div className="mb-3 d-flex flex-column  border-bottom pb-2">
            <span className="text-muted">活動時間</span>
            <span>{ticketData.orderDetails.activityTime}</span>
          </div>
          <div className="mb-3 d-flex flex-column  border-bottom pb-2">
            <span className="text-muted">活動地點</span>
            <span>{ticketData.orderDetails.activityLocation}</span>
          </div>

          <div className="mt-4 mb-2">
            <p className="mb-3 text-muted">參加者資訊</p>
            <div className="mb-3 d-flex flex-column  border-bottom pb-2">
              <span className="text-muted">姓名</span>
              <span>{ticketData.participantInfo.name}</span>
            </div>
            <div className="mb-3 d-flex flex-column  border-bottom pb-2">
              <span className="text-muted">電子郵件</span>
              <span>{ticketData.participantInfo.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 11. 導出主組件
export default TicketDetailPage;
