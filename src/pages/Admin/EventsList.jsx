
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



// 假資料
const sampleData = [
  {
    order_id: "1c8da31a-5fd2-44f3-897e-4a259e7ec62b",
    name: "台北愛樂《春之頌》交響音樂會",
    location: "臺北國家音樂廳",
    start_at: "2025-05-05 18:00",
    end_at: "2025-05-05 20:00",
    cover_image_url: "https://fakeimg.pl/120x160/?text=PICTURE",
    status: '待審核',
    sale_rate: null
  },
  {
    order_id: "1c8da31a-5fd2-44f3-897e-4a257ec62b",
    name: "台北愛樂交響音樂會",
    location: "臺北國家音樂廳",
    start_at: "2025-05-06 18:00",
    end_at: "2025-05-05 20:00",
    cover_image_url: "https://fakeimg.pl/120x160/?text=PICTURE",
    status: '銷售中',
    sale_rate: 0.95
  },
  {
    order_id: "1c8da31a-5fd2-44f897e-4a259e7ec62b",
    name: "台北愛樂《下下之頌》交響音樂會",
    location: "臺北國家音樂廳",
    start_at: "2025-07-05 18:00",
    end_at: "2025-05-05 20:00",
    cover_image_url: "https://fakeimg.pl/120x160/?text=PICTURE",
    status: '待審核',
    sale_rate: null
  },{
    order_id: "1c8da31a-5fd2-44f3-897e-4a25ec62b",
    name: "台北愛樂《春頌》交響音樂會",
    location: "臺北國家音樂廳",
    start_at: "2025-07-15 18:00",
    end_at: "2025-05-05 20:00",
    cover_image_url: "https://fakeimg.pl/120x160/?text=PICTURE",
    status: '銷售結束',
    sale_rate: 0.93
  },{
    order_id: "1c8da31a-5fd2-4f3-897e-4a259ec62b",
    name: "愛樂《春》交響音樂會",
    location: "臺北國家音樂廳",
    start_at: "2025-08-05 18:00",
    end_at: "2025-05-05 20:00",
    cover_image_url: "https://fakeimg.pl/120x160/?text=PICTURE",
    status: '銷售結束',
    sale_rate: 0.9
  },{
    order_id: "1cda31a-5f2-44f3-897e-4a2e7ec62b",
    name: "台北愛樂《頌》音樂會",
    location: "臺北國家音樂廳",
    start_at: "2025-09-20 18:00",
    end_at: "2025-05-05 20:00",
    cover_image_url: "https://fakeimg.pl/120x160/?text=PICTURE",
    status: '銷售中',
    sale_rate: 0.98
  },{
    order_id: "1c8da31a-5f2-4f3-89e-4a259e762b",
    name: "台樂《春之頌》交響音樂會",
    location: "臺北國家音樂廳",
    start_at: "2025-10-05 18:00",
    end_at: "2025-05-05 20:00",
    cover_image_url: "https://fakeimg.pl/120x160/?text=PICTURE",
    status: '銷售中',
    sale_rate: 0.9
  },
  
];

// 製造表格
const DataTable = memo(({filterProducts, handleNavigate}) => {
  let month = ""
  let changeMonth = false

  return (
    <>  
      {filterProducts.map((product) =>{
        return(
          <div  key={product.order_id}>

            <a className="text-decoration-none" href="#" onClick={(e) => {
              e.preventDefault();
              // handleNavigate(`/evevtInfo/${product.order_id}`)
            }}>

              <div  className="bg-white my-3 d-flex align-items-center border border-2 border-black p-3">
                <div className="flex-shrink-0">
                  <img src={ product.cover_image_url} alt="..."/>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="d-flex flex-column-reverse flex-sm-row justify-content-between 
                  align-items-sm-center align-items-start">

                    <div className=" my-2 text-muted">
                      <p className=" m-0" >{product.start_at}</p>
                      <h4 className="fw-bold text-start my-2">{product.name}</h4>

                      <div className="d-flex align-items-center">
                        <img src={locationIcon} alt="icon" />
                        <p className=" m-0 ms-1 align-self-end" >{product.location}</p>
                      </div>

                      {product.sale_rate && <p className=" m-0 mt-2" >售票率：{product.sale_rate*100}</p>}
                      
                    </div>
                    
                    <div className=" my-2 flex-shrink-0 text-black justify-content-sm-end justify-content-start d-flex" style={{minWidth:75+'px'}}>

                      {product.status == "銷售結束" ?
                      <p className=" border-bottom border-top border-gray-dark border-3 p-1 m-0" >
                        銷售結束
                      </p>
                      :
                      product.status == "待審核" ?
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
  const { headerHeight } = useAuth();
  const navigate = useNavigate();
  const [activeState, setActiveState] = useState('全部'); 

  const filterProducts = useMemo(() => {
    return [...sampleData]
      .filter((product) => {
        return  (product.status == (activeState) || activeState == '全部');
      });
  }, [activeState]);


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




  return (
    <div className='bg-body-tertiary ' style={{minHeight:405+'px'}}>
      <div  className='container py-3 px-md-5' >
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
          <ul className={`nav ${isFixed?"container px-md-5":"" }`}>
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
