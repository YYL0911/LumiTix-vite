import { useLocation, useNavigate } from "react-router-dom";

// 元件
import Breadcrumb from "../../conponents/Breadcrumb";

//麵包屑
const breadcrumb = [
  { name: '首頁', path: "/" },
  { name: '活動訂單', path: "/events" },
  { name: '驗票結果', path: "/" },
];

function TicketScanerResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result } = location.state || {};  // 要加 || {} 防止錯誤
  return (
    <div className='container py-3 d-flex flex-column '>

      {/* 麵包屑 */}
      <Breadcrumb breadcrumbs = {breadcrumb}></Breadcrumb>

      {result.status  ? (
      <>
        <h1 className='p-3 border border-2 border-dark-subtle d-inline-block text-success fw-bold align-self-center'>
          驗票成功
        </h1>
        <div className='my-3'>
          詳細資訊:
          <div className='my-2 p-3 border border-3 border-dark text-secondary'>
            訂單編號
            <p className="border-bottom border-2 text-black">{result.data.ticket_no}</p>
            活動名稱
            <p className="border-bottom border-2 text-black">{result.data.event.title}</p>
            活動時間
            <p className="border-bottom border-2 text-black">{result.data.event.start_at.substring(0,10)}</p>
            活動地點
            <p className="border-bottom border-2 text-black">{result.data.event.location}</p>
            <br />參加者資訊<br />
            姓名
            <p className="border-bottom border-2 text-black">{result.data.user.name}</p>
            電子郵件
            <p className="border-bottom border-2 text-black">{result.data.user.email}</p>
          </div>
        </div>
      </>
      ) : (
      <>
        <h1 className='p-3 border border-2 border-dark-subtle d-inline-block text-danger fw-bold align-self-center'>
          驗票失敗
        </h1>
        <div className='my-3'>
          詳細資訊:
          <div className='my-2 p-3 text-danger text-center text-break'>
            {result.message}
          </div>
        </div>
      </>
      )}
     
      <div className="d-flex justify-content-between" >
          <div className="col-6 pe-2">
            <button
              type="button"
              className="btn btn-outline-dark w-100"
              onClick={() => navigate("/ticketScaner")}
            >
              繼續驗票
            </button>
          </div>
          <div className="col-6 ps-2">
              <button
                type="button"
                className={`btn btn-dark w-100`}
                onClick={() => navigate("/events")}
              >
                結束驗票
              </button>
          </div>
      </div>
      
    </div>
  );
}

export default TicketScanerResult;
