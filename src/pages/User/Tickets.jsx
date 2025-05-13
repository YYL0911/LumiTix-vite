
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, memo, useRef } from 'react';

// Context
import { useAuth } from '../../contexts/AuthContext';

// 元件
import Breadcrumb from "../../conponents/Breadcrumb";
import Loading from "../../conponents/Loading";


import locationIcon from "../../assets/img/location_on.png"

//麵包屑
const breadcrumb = [
  { name: '首頁', path: "/" },
  { name: '票務管理', path: "/" },
];



// 假資料
const sampleData = [
  {
    order_id: "1c8da31a-5fd2-44f3-897e-4a259e7ec62b",
    title: "台北愛樂《春之頌》交響音樂會",
    location: "臺北國家音樂廳",
    start_at: "2025-05-05 18:00",
    end_at: "2025-05-05 20:00",
    cover_image_url: "https://fakeimg.pl/120x160/?text=PICTURE",
    ticket_status: "used"
  },
  {
    order_id: "1c8da31a-5fd2-44f3-897e-4a257ec62b",
    title: "台北愛樂交響音樂會",
    location: "臺北國家音樂廳",
    start_at: "2025-05-06 18:00",
    end_at: "2025-05-05 20:00",
    cover_image_url: "https://fakeimg.pl/120x160/?text=PICTURE",
    ticket_status: "unused"
  },
  {
    order_id: "1c8da31a-5fd2-44f897e-4a259e7ec62b",
    title: "台北愛樂《下下之頌》交響音樂會",
    location: "臺北國家音樂廳",
    start_at: "2025-07-05 18:00",
    end_at: "2025-05-05 20:00",
    cover_image_url: "https://fakeimg.pl/120x160/?text=PICTURE",
    ticket_status: "used"
  },{
    order_id: "1c8da31a-5fd2-44f3-897e-4a25ec62b",
    title: "台北愛樂《春頌》交響音樂會",
    location: "臺北國家音樂廳",
    start_at: "2025-07-15 18:00",
    end_at: "2025-05-05 20:00",
    cover_image_url: "https://fakeimg.pl/120x160/?text=PICTURE",
    ticket_status: "unused"
  },{
    order_id: "1c8da31a-5fd2-4f3-897e-4a259ec62b",
    title: "愛樂《春》交響音樂會",
    location: "臺北國家音樂廳",
    start_at: "2025-08-05 18:00",
    end_at: "2025-05-05 20:00",
    cover_image_url: "https://fakeimg.pl/120x160/?text=PICTURE",
    ticket_status: "used"
  },{
    order_id: "1cda31a-5f2-44f3-897e-4a2e7ec62b",
    title: "台北愛樂《頌》音樂會",
    location: "臺北國家音樂廳",
    start_at: "2025-09-20 18:00",
    end_at: "2025-05-05 20:00",
    cover_image_url: "https://fakeimg.pl/120x160/?text=PICTURE",
    ticket_status: "used"
  },{
    order_id: "1c8da31a-5f2-4f3-89e-4a259e762b",
    title: "台樂《春之頌》交響音樂會",
    location: "臺北國家音樂廳",
    start_at: "2025-10-05 18:00",
    end_at: "2025-05-05 20:00",
    cover_image_url: "https://fakeimg.pl/120x160/?text=PICTURE",
    ticket_status: "used"
  },
  
];

// 製造表格
const DataTable = memo(({filterProducts, handleNavigate}) => {
  let month = ""
  let changeMonth = false

  return (
    <>  
      {filterProducts.map((product) =>{
        if(month != product.start_at.substring(0,7)){
          month = product.start_at.substring(0,7)
          changeMonth = true
        }
        else changeMonth = false
        
        return(
          <div  key={product.order_id}>

            { changeMonth ? 
            <div className="mt-5 text-muted fw-bold">
              {month}
            </div>
            :<></>
            }
            <a className="text-decoration-none" href="#" onClick={(e) => {
              e.preventDefault();
              // handleNavigate(`/evevtInfo/${product.order_id}`)
            }}>

              <div  className="bg-white my-3 d-flex align-items-center border border-2 border-black p-3">
                <div className="flex-shrink-0 " style={{width:120+'px', height:160+'px'}}>
                  <img src={ product.cover_image_url} className="img-fluid object-fit-cover h-100 " alt="..."/>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="d-flex flex-column-reverse flex-sm-row justify-content-between 
                  align-items-sm-center align-items-start">

                    <div className=" my-2 text-muted">
                      {/* <p className=" m-0" >{product.start_at}</p> */}
                      <p className=" m-0" >{product.start_at.substring(0,10)} {product.start_at.substring(11,16)}</p>
                      
                      <h4 className="fw-bold text-start my-2">{product.title}</h4>

                      <div className="d-flex align-items-center">
                        <img src={locationIcon} alt="icon" />
                        <p className=" m-0 ms-1 align-self-end" >{product.location}</p>
                      </div>
                      
                    </div>
                    
                    <div className=" my-2 flex-shrink-0 text-black">
                      {product.ticket_status == 'used'?
                      <p className=" border-bottom border-top border-gray-dark border-3 p-1 m-0" >
                        已使用
                      </p>
                      :
                      <p className=" border-bottom border-top border-danger border-3 p-1 m-0 fw-bold" >
                        未使用
                      </p>}
                    </div>
                    
                  </div>
                </div>
              </div> 
              
            </a>
            </div>
          )
        } 
      )
    }
  </>
        
)
})


const tabs = [
  { key: null, label: '全部' },
  { key: "used", label: '已使用' },
  { key: "unused", label: '未使用' },
];

function Tickets() {
  const { headerHeight, loading, userToken } = useAuth();
  const navigate = useNavigate();
  const [activeState, setActiveState] = useState(null);
  const [allData, setAllData] = useState(null); 

 

  const isFirstRender = useRef(true); // 記錄是否是第一次渲染
  const [apiLoading, setApiLoading] = useState(false); // 使否開啟loading，傳送並等待API回傳時開啟
    useEffect(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false; // 更新為 false，代表已執行過
        // console.log("✅ useEffect 只執行一次");
        setApiLoading(true)
        fetch("https://n7-backend.onrender.com/api/v1/orders",{
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
              else navigate("/");
            }
            else{
              setAllData(result.data)
            }
          })
          .catch(err => {
            console.log(err);
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
    // return [...sampleData]
    //   .filter((product) => {
    //     return  activeState==null ? true : product.ticket_status == (activeState);
    //   });


    return allData ? [...allData]
      .filter((product) => {
        return  activeState==null ? true : product.ticket_status == (activeState);
      })
      :[];


  }, [activeState, allData]);


  const handleNavigate = (path => navigate(path) ); 
  const tabRef = useRef(null);
  const [isFixed, setIsFixed] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      const tabTop = tabRef.current?.offsetTop;
      if (tabTop < window.scrollY) setIsFixed(true);
      else setIsFixed(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);




  return (
    <div className='bg-body-tertiary ' style={{minHeight:405+'px'}}>
      <div  className='container py-3' >
        {/* 麵包屑 */}
        <Breadcrumb breadcrumbs = {breadcrumb}></Breadcrumb>

        {isFixed && <div style={{top: `${headerHeight}px`}}></div>}
        <div ref={tabRef} 
         style={{
          position: isFixed ? 'fixed' : 'static',
          top: `${headerHeight}px`,
        }}

        className={`${isFixed ? 
          ` start-0 end-0 bg-white py-2 border-bottom border-dark-subtle`
          : 
          'py-2 border border-3 border-dark-subtle bg-white my-4 '}
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
          handleNavigate={handleNavigate}>
        </DataTable>

      </div>

      {(!loading && apiLoading) && (<Loading></Loading>)}
    </div>
  );
}

export default Tickets;
