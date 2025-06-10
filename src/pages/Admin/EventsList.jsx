
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, memo, useRef } from 'react';

// Context
import { useAuth } from '../../contexts/AuthContext';

// 元件
import Breadcrumb from "../../conponents/Breadcrumb";

import locationIcon from "../../assets/img/location_on.png"

//麵包屑
const breadcrumb = [
  { name: '首頁', path: "/" },
  { name: '活動管理', path: "/" },
];




// 製造表格
const DataTable = memo(({filterProducts, handleNavigate}) => {
  let month = ""
  let changeMonth = false

  return (
    <>  
      {filterProducts.map((product) =>{
        return(
          <div  key={product.id}>

            <a className="text-decoration-none" href="#" onClick={(e) => {
              e.preventDefault();
              if(product.sale_status != "待審核") handleNavigate(`/eventRevenue/${product.id}`); 
              else handleNavigate(`/eventReview/${product.id}`); 
            }}>

              <div  className="bg-white my-3 d-flex align-items-center border border-2 border-black p-3">
                <div className="flex-shrink-0 " style={{width:120+'px', height:160+'px'}}>
                  <img src={ product.cover_image_url} className="img-fluid object-fit-cover h-100 " alt="..."/>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="d-flex flex-column-reverse flex-sm-row justify-content-between 
                  align-items-sm-center align-items-start">

                    <div className=" my-2 text-muted">
                      <p className=" m-0" >{product.start_at}</p>
                      <h4 className="fw-bold text-start my-3 text-black">{product.title}</h4>

                      <div className="d-flex align-items-center">
                        <img src={locationIcon} alt="icon" />
                        <p className=" m-0 ms-1 align-self-end" >{product.location}</p>
                      </div>

                      {product.sale_status != "待審核" && <p className=" m-0 mt-2" >售票率：{product.sale_rate*100}%</p>}
                      
                    </div>
                    
                    <div className=" my-2 flex-shrink-0 text-black justify-content-sm-end justify-content-start d-flex" style={{minWidth:75+'px'}}>

                      {product.sale_status == "銷售結束" ?
                      <p className=" border-bottom border-top border-gray-dark border-3 p-1 m-0" >
                        銷售結束
                      </p>
                      :
                      product.sale_status == "待審核" ?
                      <p className=" border-bottom border-top border-danger border-3 p-1 m-0 fw-bold" >
                        待審核
                      </p>
                      :
                      <p className=" border-bottom border-top border-success border-3 p-1 m-0 fw-bold" >
                        銷售中
                      </p>
                      }
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
  { key: '全部', label: '全部'},
  { key: '待審核', label: '待審核'},
  { key: '銷售中', label: '銷售中'},
  { key: '銷售結束', label: '銷售結束' },
];

function EventsList() {
  const { headerHeight, loading, userToken } = useAuth();
  const navigate = useNavigate();
  const [activeState, setActiveState] = useState('全部'); 
  const [allData, setAllData] = useState([]); 


  const isFirstRender = useRef(true); // 記錄是否是第一次渲染
  const [apiLoading, setApiLoading] = useState(false); // 使否開啟loading，傳送並等待API回傳時開啟
    useEffect(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false; // 更新為 false，代表已執行過
        // console.log("✅ useEffect 只執行一次");
        setApiLoading(true)
        fetch("https://n7-backend.onrender.com/api/v1/admin/events",{
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
              setAllData(result.data.events)
            }
          })
          .catch(err => {
            navigate("/ErrorPage")
          });
      }
    }, []);



  const filterProducts = useMemo(() => {
    return allData ? [...allData]
      .filter((product) => {
        return  (product.sale_status == (activeState) || activeState == '全部');
      }):[];
  }, [activeState, allData]);


  // 滑到頂部
  useEffect(() =>{
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  },[activeState])


  const handleNavigate = (path => navigate(path) ); 
  const tabRef = useRef(null);
  const [isFixed, setIsFixed] = useState(false);
  const [tabHeight, setTabHeight] = useState(0);


  useEffect(() => {
    const handleScroll = () => {
      const tabTop = tabRef.current?.offsetTop;

      if (tabTop < window.scrollY) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
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




  return (
    <div className='bg-body-tertiary flex-grow-1 ' >
      <div  className='container py-3 px-md-5' >
        {/* 麵包屑 */}
        <Breadcrumb breadcrumbs = {breadcrumb}></Breadcrumb>

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
          handleNavigate={handleNavigate}>
        </DataTable>

      </div>
    </div>
  );
}

export default EventsList;
