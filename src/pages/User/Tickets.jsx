
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
    id: 1,
    title: '台北愛樂《春之頌》交響音樂會',
    showDate:"2024/12/31",
    showTime:"20:00~20:50",
    location:"台北演藝廳",
    activeState:false,
    imgSrc:"https://fakeimg.pl/120x160/?text=PICTURE",
  },
  {
    id: 2,
    title: '台北愛樂《下之頌》交響音樂會',
    showDate:"2024/10/31",
    showTime:"20:00~20:50",
    location:"台北演藝廳",
    activeState:true,
    imgSrc:"https://fakeimg.pl/120x160/?text=PICTURE",
  },
  {
    id: 3,
    title: '台北愛樂《東之頌》交響音樂會',
    showDate:"2024/5/31",
    showTime:"20:00~20:50",
    location:"台北演藝廳",
    activeState:false,
    imgSrc:"https://fakeimg.pl/120x160/?text=PICTURE",
  },
  {
    id: 4,
    title: '交響音樂會',
    showDate:"2024/12/31",
    showTime:"20:00~20:50",
    location:"台北演藝廳",
    activeState:true,
    imgSrc:"https://fakeimg.pl/120x160/?text=PICTURE",
  },
  {
    id: 5,
    title: '台北愛樂《下之頌》',
    showDate:"2024/10/31",
    showTime:"20:00~20:50",
    location:"台北演藝廳",
    activeState:true,
    imgSrc:"https://fakeimg.pl/120x160/?text=PICTURE",
  },
  {
    id: 6,
    title: '台交響音樂會',
    showDate:"2024/5/31",
    showTime:"20:00~20:50",
    location:"台北演藝廳",
    activeState:false,
    imgSrc:"https://fakeimg.pl/120x160/?text=PICTURE",
  },
  
];

// 製造表格
const DataTable = memo(({filterProducts, handleNavigate}) => {
  return (
    <>  
      {filterProducts.map((product) => (

        <div key={product.id} className="bg-white my-3 d-flex align-items-center border border-2 border-black p-3">
        <div className="flex-shrink-0">
          <img src="https://fakeimg.pl/120x160/?text=PICTURE" alt="..."/>
        </div>
        <div className="flex-grow-1 ms-3">
          <div className="d-flex flex-column-reverse flex-sm-row justify-content-between 
          align-items-sm-center align-items-start">

            <div className=" my-2">
              <p className=" m-0" >{product.showDate} {product.showTime}</p>
              <h4 className="fw-bold mb-0 text-start">{product.title}</h4>
              <p className=" m-0" >{product.location}</p>
            </div>
            
            <div className=" my-2 flex-shrink-0">
              {product.activeState?
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
            
      ))}
    
    
    </>
        
)
})

function Tickets() {
  const navigate = useNavigate();
  const [activeState, setActiveState] = useState(null); //Ing Finish Check

  const filterProducts = useMemo(() => {
    return [...sampleData]
      .filter((product) => {
        return  activeState==null ? true : product.activeState == (activeState);
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
