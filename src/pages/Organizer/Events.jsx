import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// Context
import { useAuth } from "../../contexts/AuthContext";
import {getAllEvents, cancleEvents} from '../../api/organizer'

// 元件
import Breadcrumb from "../../conponents/Breadcrumb";
import Loading from "../../conponents/Loading";

import { RiAddBoxLine } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";

//麵包屑
const breadcrumb = [
  { name: "首頁", path: "/" },
  { name: "活動訂單", path: "/events" },
];

const showSwal = (icon, title, info) => {
    withReactContent(Swal).fire({
      icon: icon,
      title: title,
      text: info,
    })
}


function Events() {
  const { loading } = useAuth(); // [變更使用者名稱, token]
  const [apiLoading, setApiLoading] = useState(false); // 使否開啟loading，傳送並等待API回傳時開啟
  const [allData, setAllData] = useState(null);

  const isFirstRender = useRef(true); // 記錄是否是第一次渲染
  //取得使用者資料
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // 更新為 false，代表已執行過
      // console.log("useEffect 只執行一次");
      setApiLoading(true);

      getAllEvents()
      .then(result => {
        setAllData(result.data);
      })
      .catch(err => {
        navigate(err.route)
      })
      .finally (() =>{
        setApiLoading(false);
      })
    }
  }, []);

  const navigate = useNavigate();
  const [activeState, setActiveState] = useState("holding"); //Ing finished Check

  const filterProducts = useMemo(() => {
    return allData ? allData[activeState] : [];
  }, [activeState, allData]);

  const handleNavigate = (path) => navigate(path);

  const ref = useRef(null);
  let isDown = false;
  let startX;
  let scrollLeft;

  useEffect(() => {
    const slider = ref.current;

    const mouseDown = (e) => {
      isDown = true;
      slider.classList.add("dragging");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const mouseLeave = () => {
      isDown = false;
      slider.classList.remove("dragging");
    };

    const mouseUp = () => {
      isDown = false;
      slider.classList.remove("dragging");
    };

    const mouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5; // 拖曳速度倍率
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener("mousedown", mouseDown);
    slider.addEventListener("mouseleave", mouseLeave);
    slider.addEventListener("mouseup", mouseUp);
    slider.addEventListener("mousemove", mouseMove);

    return () => {
      slider.removeEventListener("mousedown", mouseDown);
      slider.removeEventListener("mouseleave", mouseLeave);
      slider.removeEventListener("mouseup", mouseUp);
      slider.removeEventListener("mousemove", mouseMove);
    };
  }, []);



  const deleteEvent = (eventId) => {
    setApiLoading(true);
    cancleEvents(eventId)
      .then(result => {
        showSwal("success", "刪除成功", "已刪除資料")
        allData[activeState].map((item, idx) => {
          if(item.id == eventId){
            allData[activeState].splice(idx,1)
          }
        })
        setAllData(allData);
      })
      .catch(err => {
        if(err.type == "OTHER") showSwal("error", "刪除失敗", result.message)
        else navigate(err.route)
      })
      .finally (() =>{
        setApiLoading(false);
      })

  }

  return (
    <div className="container py-3">
      {/* 麵包屑 */}
      <Breadcrumb breadcrumbs={breadcrumb}></Breadcrumb>

      {/* 新增活動 */}
      <button
        type=" button"
        className="btn btn-danger btn-lg my-4 d-flex align-items-center justify-content-center"
        onClick={() => {
          handleNavigate(`/organizer/event/new`);
        }}
      >
        新增活動
        <RiAddBoxLine size={25} className={`ms-2`} />
      </button>


      {/* 活動狀態 */}
      <div ref={ref} className="scroll-container d-flex overflow-auto my-3 text-nowrap ">
        {["checking", "holding", "finished", "rejected"].map((key, index) => (
          <button
            key={index}
            className={`btn me-3   ${activeState === key ? "btn-secondary" : "btn-outline-dark"}   `}
            onClick={() => setActiveState(key)}
          >
            {key === "holding" && `正在舉辦 (${allData?.holding.length ?? 0})`}
            {key === "finished" && `已經結束 (${allData?.finished.length ?? 0})`}
            {key === "checking" && `正在審核 (${allData?.checking.length ?? 0})`}
            {key === "rejected" && `被拒絕 (${allData?.rejected.length ?? 0})`}
          </button>
        ))}
      </div>

      {/* 根據狀態產生活動列表 */}
      {filterProducts.length > 0 ? 
        <div className="table-responsive" >
          <table className="table  text-center align-middle table-hover">
            <thead >
              <tr>
                <th scope="col" className="text-wrap text-break text-start" style={{ minWidth: "150px" }}>
                  活動名稱
                </th>
                <th scope="col" className="text-wrap text-break" style={{ minWidth: "120px" }}>
                  表演時段
                </th>
                <th scope="col" className="text-wrap text-break" style={{ minWidth: "120px" }}>
                  購票人數
                </th>
                <th scope="col" className="text-wrap text-break" style={{ minWidth: "220px" }}>
                  操作
                </th>
                <th scope="col" className={`text-wrap text-break ${["checking"].includes(activeState) ? "" : "d-none"}`} style={{ minWidth: "100px" }}>
                  刪除
                </th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
      
              {filterProducts.map((product) => (
                <tr key={product.id}>
                  <td className="text-wrap text-break text-start">{product.title}</td>
                  <td className="text-wrap text-break">
                    {product.start_at.substring(0, 10)}
                    <br />
                    {product.start_at.substring(11, 16)}~{product.end_at.substring(11, 16)}
                  </td>
                  <td>{product.ticket_purchaced}/{product.ticket_total}</td>
                  <td>
                    <button
                      type="button"
                      className={`btn btn-dark mx-1  
                        ${["checking"].includes(activeState) ? "" : "d-none"}`}
                      onClick={() =>handleNavigate(`/organizer/event/edit/${product.id}`)}
                    >
                      編輯資訊
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary mx-1"
                      onClick={() => navigate(`/eventDetail/${product.id}`, { state: { activeState: activeState} })}
                    >
                      詳細內容
                    </button>
                  </td>

                  <td>
                    <button
                      type="button"
                      className={`btn btn-danger mx-1 ${["checking"].includes(activeState) ? "" : "d-none"}`}
                      onClick={() => deleteEvent(`${product.id}`)}
                    >
                      <RiDeleteBin6Line size={22} className={`pb-1`} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      :
        <h3 className="my-4">無符合狀態活動</h3>
      }
      {!loading && apiLoading && <Loading></Loading>}
    </div>
  );
}

export default Events;
