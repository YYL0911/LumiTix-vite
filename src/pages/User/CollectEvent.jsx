
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, memo, useRef } from 'react';
import dayjs from "dayjs";

// Context
import { useAuth } from '../../contexts/AuthContext';

// 元件
import Breadcrumb from "../../conponents/Breadcrumb";
import Loading from "../../conponents/Loading";

// 圖片
import locationIcon from "../../assets/img/location_on.png"

import { IoHeartCircleOutline } from "react-icons/io5";

//麵包屑
const breadcrumb = [
  { name: "首頁", path: "/" },
  { name: "我的收藏", path: "/collectEvent" },
];

// 製造表格 
const DataTable = memo(({filterProducts, handleNavigate, onToggleCollect}) => {
  
  if( filterProducts.length == 0){
    return (<h3 className='mb-3 text-secondary'> 沒有符合收藏</h3>)
  }
  
  return (
    <> 
      {filterProducts.map((product) =>{
        return(
          <div  key={product.id}>
            <a className="text-decoration-none position-relative" href="#" onClick={(e) => {
              e.preventDefault();
              handleNavigate(`/eventInfo/${product.id}`);
            }}>

              <div  className="bg-white my-3 d-flex align-items-center border border-2 border-black p-3">
                
                <div className={`top-0 end-0 `}>
                  <IoHeartCircleOutline size={30} color="red" className="position-absolute top-0 end-0" type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // 阻止事件冒泡到 a
                    e.preventDefault();  // 阻止 <a> 的預設跳轉行為
                    onToggleCollect(product.id)
                  }} />
                </div>
                
                
                <div className="flex-shrink-0 " style={{width:120+'px', height:160+'px'}}>
                  <img src={ product.cover_image_url} className="img-fluid object-fit-cover h-100 " alt="..."/>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="d-flex flex-column-reverse flex-sm-row justify-content-between align-items-sm-center align-items-start">
                    <div className=" my-2 text-muted">
                      <p className=" m-0" >{product.start_at.substring(0,10)} {product.start_at.substring(11,16)}</p>
                      <h4 className="fw-bold text-start my-3 text-black">{product.title}</h4>
                      <div className="d-flex align-items-center">
                        <img src={locationIcon} alt="icon" />
                        <p className=" m-0 ms-1 align-self-end" >{product.location}</p>
                      </div>
                    </div>
                    
                    <div className=" my-2 flex-shrink-0 text-black">
                      {product.status == 'finish'?
                        <p className=" border-bottom border-top  border-secondary border-3 p-1 m-0" >
                          結束販售
                        </p>
                      :
                        product.status == 'unstart'?
                        <p className=" border-bottom border-top border-danger border-3 p-1 m-0 fw-bold" >
                          尚未販售
                        </p>
                        :
                        <p className=" border-bottom border-top border-success border-3 p-1 m-0 fw-bold" >
                          正在販售
                        </p>}
                    </div>
                  </div>
                </div>
              </div> 
            </a>
          </div>
        )
      })}
    </>
  )
})


const tabs = [
  { key: null, label: '全部' },
  { key: "unstart", label: '尚未販售' },
  { key: "ing", label: '正在販售' },
  { key: "finish", label: '結束販售' },
];

function Tickets() {
  const { headerHeight, loading, userToken } = useAuth();
  const navigate = useNavigate();
  const [activeState, setActiveState] = useState(null);
  const [allData, setAllData] = useState(null); 

  const isFirstRender = useRef(true); // 記錄是否是第一次渲染
  const [userBlock, setUserBlock] = useState(0);
  const [apiLoading, setApiLoading] = useState(false); // 使否開啟loading，傳送並等待API回傳時開啟
    useEffect(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false; // 更新為 false，代表已執行過
        // console.log("✅ useEffect 只執行一次");
        setApiLoading(true)
        fetch("https://n7-backend.onrender.com/api/v1/users/collect",{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`, // token 放這
          }}) 
          .then(res => res.json())
          .then(result => {
            setApiLoading(false)

            if(!result.status){
              if(result.message == "尚未登入") navigate("/login");
              else if(result.message == "使用者已被封鎖") setUserBlock(-1)
              else navigate("/");
            }
            else{
              const now = new Date();
              const eventsWithStatus = [...result.data].map(event => {
                const start = new Date(event.sale_start_at);
                const end = new Date(event.sale_end_at);

                let status = "";
                if (now < start) status = "unstart";
                else if (now >= start && now <= end) status = "ing";
                else status = "finish";
                return { ...event, status };
              });

              setAllData(eventsWithStatus)
              setUserBlock(1)
            }
          })
          .catch(err => {
            navigate("/ErrorPage")
          });
      }
    }, []);


  // 滑到頂部
  useEffect(() =>{
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  },[activeState])

  const filterProducts = useMemo(() => {
    return allData ? [...allData]
      .filter((product) => {
        return  activeState==null ? true : product.status == (activeState);
      }):[];
  }, [activeState, allData]);


  // const handleNavigate = (path) => navigate(path, { state:true });
  const handleNavigate = (path, collect = true) => navigate(path, { state: { collect } });
  const tabRef = useRef(null);
  const [isFixed, setIsFixed] = useState(false);
  const [tabHeight, setTabHeight] = useState(0);


  useEffect(() => {
    const handleScroll = () => {
      const tabTop = tabRef.current?.offsetTop;
      if (tabTop < window.scrollY) setIsFixed(true);
      else setIsFixed(false);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (tabRef.current) setTabHeight(tabRef.current.offsetHeight);
    
    const handleResize = () => {
      if (tabRef.current) setTabHeight(tabRef.current.offsetHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const  onToggleCollect = (eventId) => {
    const token = localStorage.getItem("token");
    fetch(`https://n7-backend.onrender.com/api/v1/users/toggle-collect/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // token 放這
        },
      })
        .then((res) => res.json())
        .then((result) => {

          
          setAllData(prev => prev.filter(item => item.id !== eventId));
        })
        .catch((err) => {
          navigate("/ErrorPage")
        });
   
    //   setCollectEvent(prev => [...prev, newCollect]);
    
  }



  return (
    <div className="bg-body-tertiary flex-grow-1" >
      <div  className='container py-3' >
        {/* 麵包屑 */}
        <Breadcrumb breadcrumbs = {breadcrumb}></Breadcrumb>

        {userBlock == -1 && (<h3 className='mb-3 text-secondary text-center '>帳號已被封鎖</h3>)}

        {allData?.length == 0 ? 
        
          <div className={`${userBlock == 1 ? "d-block": "d-none"} `}>
            <h3 className='my-3 text-secondary text-center '>沒有收藏活動</h3>
            <div className="d-flex align-items-center my-5 justify-content-center ">
              <span className="me-2 text-body-secondary">快去查看活動!</span>
              <button type="button" className={`btn btn-danger py-2`} onClick={() => handleNavigate(`/allEvents`)}>
                活動查詢 
              </button>
            </div>
          </div>
        :
          <div className={`${userBlock == 1 ? "d-block": "d-none"}`}>
            {/* 撐高假區塊 */}
            <div 
              style={{ height: `${tabHeight}px` }} className={`'  ${isFixed ?"d-block":"d-none"} '`}>
            </div>

            {/* tab欄位 */}
            <div ref={tabRef} 
            style={{
              position: isFixed ? 'fixed' : 'static',
              top: `${headerHeight}px`,
            }}
            className={`   bg-white py-2   border-dark-subtle 
              ${isFixed ? 
              ` start-0 end-0 border-bottom ` : ' border border-3  my-4'}
            `}>
              <ul className={`nav ${isFixed?"container ":"" }`}>
                {tabs.map((tab) => (
                    <li className="nav-item" key={tab.key}>
                      <button
                        className={`nav-underline-custom nav-link ${activeState === tab.key ? 'active' : ''}`}
                        onClick={() => setActiveState(tab.key)}
                      >
                        {tab.label}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>

            
            {/* 根據狀態產生活動列表 */}
            <DataTable 
              filterProducts={filterProducts} 
              handleNavigate={handleNavigate}
              onToggleCollect={onToggleCollect}>
            </DataTable>
          </div>
        }
      </div>

      {(!loading && apiLoading) && (<Loading></Loading>)}
    </div>
  );
}

export default Tickets;
