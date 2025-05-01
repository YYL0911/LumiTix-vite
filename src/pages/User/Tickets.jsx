
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, memo } from 'react';

// 元件
import Breadcrumb from "../../conponents/Breadcrumb";

//麵包屑
const breadcrumb = [
  { name: '首頁', path: "/" },
  { name: '票務管理', path: "/" },
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
    status: false
  },
  {
    order_id: "1c8da31a-5fd2-44f3-897e-4a257ec62b",
    name: "台北愛樂交響音樂會",
    location: "臺北國家音樂廳",
    start_at: "2025-05-06 18:00",
    end_at: "2025-05-05 20:00",
    cover_image_url: "https://fakeimg.pl/120x160/?text=PICTURE",
    status: false
  },
  {
    order_id: "1c8da31a-5fd2-44f897e-4a259e7ec62b",
    name: "台北愛樂《下下之頌》交響音樂會",
    location: "臺北國家音樂廳",
    start_at: "2025-07-05 18:00",
    end_at: "2025-05-05 20:00",
    cover_image_url: "https://fakeimg.pl/120x160/?text=PICTURE",
    status: true
  },{
    order_id: "1c8da31a-5fd2-44f3-897e-4a25ec62b",
    name: "台北愛樂《春頌》交響音樂會",
    location: "臺北國家音樂廳",
    start_at: "2025-07-15 18:00",
    end_at: "2025-05-05 20:00",
    cover_image_url: "https://fakeimg.pl/120x160/?text=PICTURE",
    status: false
  },{
    order_id: "1c8da31a-5fd2-4f3-897e-4a259ec62b",
    name: "愛樂《春》交響音樂會",
    location: "臺北國家音樂廳",
    start_at: "2025-08-05 18:00",
    end_at: "2025-05-05 20:00",
    cover_image_url: "https://fakeimg.pl/120x160/?text=PICTURE",
    status: true
  },{
    order_id: "1cda31a-5f2-44f3-897e-4a2e7ec62b",
    name: "台北愛樂《頌》音樂會",
    location: "臺北國家音樂廳",
    start_at: "2025-09-20 18:00",
    end_at: "2025-05-05 20:00",
    cover_image_url: "https://fakeimg.pl/120x160/?text=PICTURE",
    status: false
  },{
    order_id: "1c8da31a-5f2-4f3-89e-4a259e762b",
    name: "台樂《春之頌》交響音樂會",
    location: "臺北國家音樂廳",
    start_at: "2025-10-05 18:00",
    end_at: "2025-05-05 20:00",
    cover_image_url: "https://fakeimg.pl/120x160/?text=PICTURE",
    status: true
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
            <div  className="bg-white my-3 d-flex align-items-center border border-2 border-black p-3">
              <div className="flex-shrink-0">
                <img src={ product.cover_image_url} alt="..."/>
              </div>
              <div className="flex-grow-1 ms-3">
                <div className="d-flex flex-column-reverse flex-sm-row justify-content-between 
                align-items-sm-center align-items-start">

                  <div className=" my-2 text-muted">
                    <p className=" m-0" >{product.start_at}</p>
                    <h4 className="fw-bold mb-0 text-start">{product.name}</h4>
                    <p className=" m-0" >{product.location}</p>
                  </div>
                  
                  <div className=" my-2 flex-shrink-0">
                    {product.status?
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
          </div>

        )



      } 
       
          
        
            
        
    
      )
      }
    
    
    </>
        
)
})

function Tickets() {
  const navigate = useNavigate();
  const [activeState, setActiveState] = useState(null); //Ing Finish Check

  const filterProducts = useMemo(() => {
    return [...sampleData]
      .filter((product) => {
        return  activeState==null ? true : product.status == (activeState);
      });
  }, [activeState]);

  const handleNavigate = (path => navigate(path) ); 

  const tabs = [
    { key: null, label: '全部' },
    { key: true, label: '已使用' },
    { key: false, label: '未使用' },
  ];

  return (
    <div className='bg-body-tertiary ' style={{minHeight:472+'px'}}>
      <div  className='container py-3 px-md-5' >
        {/* 麵包屑 */}
        <Breadcrumb breadcrumbs = {breadcrumb}></Breadcrumb>

        <div className="py-2 border border-3 border-dark-subtle bg-white my-4">
          <ul className="nav">
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

export default Tickets;
