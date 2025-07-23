import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useRef  } from 'react';

// Context
import { useAuth } from '../../contexts/AuthContext';
import {getEventInfo} from '../../api/organizer'

// 元件
import Breadcrumb from "../../conponents/Breadcrumb";
import Loading from '../../conponents/Loading';

import { BsQrCodeScan } from "react-icons/bs";
import { BsPencilSquare } from "react-icons/bs";
import { BsArrowLeftCircle } from "react-icons/bs";

const eventStatus = [
  { key: "checking", label: '正在審核', class: "bg-danger" },
  { key: "holding", label: '正在舉辦', class: "bg-success" },
  { key: "finished", label: '已經結束', class: "bg-secondary" },
  { key: "rejected", label: '被拒絕', class: "bg-dark" },
];


const EventDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: eventId } = useParams();
  const { activeState } = location.state || {};  // 要加 || {} 防止錯誤

  const { userToken, loading,  } = useAuth();

  const [apiLoading, setApiLoading] = useState(false);
  const [eventInfo, setEventInfo] = useState({});
  const [eventStatusIdx, setEventStatusIdx] = useState(0);

  //麵包屑
  const breadcrumb = [
    { name: '首頁', path: "/" },
    { name: '活動訂單', path: "/events" },
    { name: `${eventInfo.title}詳情`, path: "/" },
  ];

  const isFirstRender = useRef(true); // 記錄是否是第一次渲染
  //取得使用者資料
  useEffect(() => {
    if (isFirstRender.current) {
      setEventStatusIdx(eventStatus.findIndex(item => item.key === activeState))
      
      isFirstRender.current = false; // 更新為 false，代表已執行過
      setApiLoading(true)

      getEventInfo(eventId)
      .then(result => {
        setEventInfo(result.data)
      })
      .catch(err => {
        navigate(err.route)
      })
      .finally (() =>{
        setApiLoading(false);
      })
    }
  }, []);

  useEffect(() => {
  }, [eventInfo]);


  const scanEvent = () => {
    localStorage.setItem("scanEventID", eventId);
    navigate(`/ticketScaner`)
  }
  


  return (
    <div className="container py-3 d-flex flex-column ">
      {/* 麵包屑 */}
      <Breadcrumb breadcrumbs={breadcrumb}></Breadcrumb>
      <div className="mt-3">
        <div className="mx-100">
          <img
            src={eventInfo.cover_image_url}
            alt={eventInfo.title}
            className="img-fluid border border-2 border-secondary p-3"
          />
        </div>

        <div className="fs-5">
          <div className="d-flex my-3">
            <div className="fw-semibold text-nowrap">活動狀態：</div>
            <div className=" flex-grow-1 ms-2">
              <span className={`badge ${eventStatus[eventStatusIdx].class}`}>{eventStatus[eventStatusIdx].label}</span>
            </div>
          </div>
          <div className="d-flex my-3">
            <div className="fw-semibold text-nowrap">活動名稱：</div>
            <div className=" flex-grow-1 ms-2">{eventInfo.title}</div>
          </div>
          <div className="d-flex mb-3">
            <div className="fw-semibold text-nowrap">活動地點：</div>
            <div className=" flex-grow-1 ms-2">{eventInfo.location}</div>
          </div>
          <div className="d-flex mb-3">
            <div className="fw-semibold text-nowrap">地　　址：</div>
            <div className=" flex-grow-1 ms-2">{eventInfo.address}</div>
          </div>
          <div className="d-flex mb-3">
            <div className="fw-semibold text-nowrap">演出開始：</div>
            <div className=" flex-grow-1 ms-2">
              {eventInfo.start_at?.substring(0, 10)} {eventInfo.start_at?.substring(11, 16)}
            </div>
          </div>
          <div className="d-flex mb-3">
            <div className="fw-semibold text-nowrap">演出結束：</div>
            <div className=" flex-grow-1 ms-2">
              {eventInfo.end_at?.substring(0, 10)} {eventInfo.end_at?.substring(11, 16)}
            </div>
          </div>
          <div className="d-flex mb-3">
            <div className="fw-semibold text-nowrap">售票開始：</div>
            <div className=" flex-grow-1 ms-2">
              {eventInfo.sale_start_at?.substring(0, 10)} {eventInfo.sale_start_at?.substring(11, 16)}
            </div>
          </div>
          <div className="d-flex mb-3">
            <div className="fw-semibold text-nowrap">售票結束：</div>
            <div className=" flex-grow-1 ms-2">
              {eventInfo.sale_end_at?.substring(0, 10)} {eventInfo.sale_end_at?.substring(11, 16)}
            </div>
          </div>
          <div className="d-flex mb-3">
            <div className="fw-semibold text-nowrap">表演人員：</div>
            <div className=" flex-grow-1 ms-2">{eventInfo.performance_group}</div>
          </div>
          <div className="d-flex mb-3">
            <div className="fw-semibold text-nowrap">類　　型：</div>
            <div className=" flex-grow-1 ms-2">{eventInfo.type}</div>
          </div>
          <div className="d-flex mb-3">
            <div className="pe-2 fw-semibold text-nowrap" style={{ alignSelf: "start" }}>
              活動介紹：
            </div>
            <div dangerouslySetInnerHTML={{ __html: eventInfo.description }} />
          </div>

          <div className="mb-3">
            <p className="fs-5 fw-semibold">分區設定：</p>
            <div className="row  justify-content-between  align-items-start">
              <div className=" col-12 col-md-7">
                <img src={eventInfo.section_image_url} alt={eventInfo.title} className="img-fluid " />
              </div>

              <div className=" col-12 col-md-5">
                <div className="table-responsive">
                  <table className="table  text-center align-middle table-hover">
                    <thead>
                      <tr>
                        <th scope="col" className="text-wrap text-break" style={{ minWidth: "90px" }}>
                          分區名稱
                        </th>
                        <th scope="col" className="text-wrap text-break" style={{ minWidth: "70px" }}>
                          票價
                        </th>
                        <th scope="col" className="text-wrap text-break" style={{ minWidth: "110px" }}>
                          購票人數
                        </th>
                      </tr>
                    </thead>
                    <tbody className="table-group-divider">
                      {eventInfo.sections?.map((product) => (
                        <tr key={product.section_name}>
                          <td className="text-wrap text-break">{product.section_name}</td>
                          <td>{product.price}</td>
                          <td>
                            {product.ticket_purchaced}/{product.ticket_total}
                          </td>
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

      <div className="d-flex justify-content-between my-5  px-sm-5">
        <div className={`col-6 col-sm-4 pe-2 mx-auto `}>
          <button
            type="button"
            className={`btn btn-dark w-100 d-flex align-items-center justify-content-center`}
            onClick={() => navigate(-1)}
          >
            返回 <BsArrowLeftCircle size={20} className={`ms-2`} />
          </button>
        </div>

        <div className={`col-6 col-sm-4 pe-2 mx-auto ${eventStatusIdx == 0 ? "d-block" : "d-none"}`}>
          <button
            type="button"
            className={`btn btn-danger w-100 d-flex align-items-center justify-content-center`}
            onClick={() => navigate(`/organizer/event/edit/${eventId}`)}
          >
            編輯資訊 <BsPencilSquare size={20} className={`ms-2`} />
          </button>
        </div>
        <div className={`col-6 col-sm-4 pe-2 mx-auto ${eventStatusIdx == 1 ? "d-block" : "d-none"}`}>
          <button
            type="button"
            className={`btn  w-100 btn-danger d-flex align-items-center justify-content-center`}
            onClick={() => scanEvent()}
          >
            驗票 <BsQrCodeScan size={20} className={`ms-2`} />
          </button>
        </div>
      </div>

      {!loading && apiLoading && <Loading></Loading>}
    </div>
  );
}

export default EventDetail;
