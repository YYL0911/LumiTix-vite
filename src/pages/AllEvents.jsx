
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useMemo, memo } from 'react';

// 元件
import Breadcrumb from "../conponents/Breadcrumb";
import Loading from "../conponents/Loading";
import PaginationComponent from "../conponents/Pagination";





// 假資料
const sampleData = [
  {
    id: 1,
    imgSrc:"https://fakeimg.pl/200x290/?text=PICTURE",
    title: '台北愛樂《春之頌》交響音樂會響音樂會響音樂會響音樂會響音樂會響音樂會響音樂',
    showDate:"2024/12/31",
    showTime:"20:00~20:50",
    location:"台北市"
  },
  {
    id: 2,
    imgSrc:"https://fakeimg.pl/200x290/?text=PICTURE",
    title: '台北愛樂《下之頌》交響音樂會',
    showDate:"2024/10/31",
    showTime:"20:00~20:50",
    location:"台北市"
  },
  {
    id: 3,
    imgSrc:"https://fakeimg.pl/200x290/?text=PICTURE",
    title: '台北愛樂《東之頌》交響音樂會',
    showDate:"2024/5/31",
    showTime:"20:00~20:50",
    location:"台北市"
  },
  {
    id: 4,
    imgSrc:"https://fakeimg.pl/200x290/?text=PICTURE",
    title: '台北愛樂《春之頌》交響音樂會',
    showDate:"2024/12/31",
    showTime:"20:00~20:50",
    location:"台北市"
  },
  {
    id: 5,
    imgSrc:"https://fakeimg.pl/200x290/?text=PICTURE",
    title: '台北愛樂《下之頌》交響音樂會',
    showDate:"2024/10/31",
    showTime:"20:00~20:50",
    location:"台北市"
  },
  {
    id: 6,
    imgSrc:"https://fakeimg.pl/200x290/?text=PICTURE",
    title: '台北愛樂《東之頌》交響音樂會',
    showDate:"2024/5/31",
    showTime:"20:00~20:50",
    location:"台北市"
  },
  {
    id: 7,
    imgSrc:"https://fakeimg.pl/200x290/?text=PICTURE",
    title: '台北愛樂《春之頌》交響音樂會',
    showDate:"2024/12/31",
    showTime:"20:00~20:50",
    location:"台北市"
  },
  {
    id: 8,
    imgSrc:"https://fakeimg.pl/200x290/?text=PICTURE",
    title: '台北愛樂《下之頌》交響音樂會',
    showDate:"2024/10/31",
    showTime:"20:00~20:50",
    location:"台北市"
  },
  {
    id: 9,
    imgSrc:"https://fakeimg.pl/200x290/?text=PICTURE",
    title: '台北愛樂《東之頌》交響音樂會',
    showDate:"2024/5/31",
    showTime:"20:00~20:50",
    location:"台北市"
  }
  
];

// 列表元件
const CardItem = ({ id, imgSrc, title, showTime, location, handleNavigate }) => (
  <a className="card mb-5 col-md-3 col-6 text-decoration-none" style={{ border: 'none' }} href="#" onClick={(e) => {
    e.preventDefault();
    handleNavigate(`/evevtInfo/${id}`)
  }}>
    
    <div className="border p-2">
      <img src={imgSrc} className="img-fluid object-fit-cover w-100" alt={title} />
    </div>
    <div className="d-flex flex-column justify-content-between mt-3" >
      
      <div className="d-flex justify-content-between text-muted small mb-2 ">
        <span>{showTime}</span>
        <span>{location}</span>
      </div>

      <div className="fw-bold text-black mb-3">{title}</div>

      <div className="mt-auto pt-2" >
        <span className=" border-bottom border-top border-danger border-3 p-2" >音樂</span>
      </div>
    </div>
    
    
  </a>


// </div>


);

// 製造表演列表
const DataTable = memo(({handleNavigate}) => {
  return (
    <>
      {sampleData.map((product) => (
        <CardItem
        key={product.id}
        id = {product.id}
        imgSrc = {product.imgSrc}
        title = {product.title}
        showTime = {product.showDate}
        location = {product.location}
        handleNavigate = {handleNavigate}
        />
      ))}
    </>
)
})

// 麵包屑
const breadcrumb = [
  { name: '首頁', path: "/" },
  { name: '活動資訊', path: "/personal" },
];


function AllEvents() {
  const navigate = useNavigate();
  //跳轉頁面
  const handleNavigate = ((path) => {
    navigate(path)
  }); 

  const [loading, setloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // const [addressData, setAddressData] = useState([]);
  // // 取得地址資料
  // useEffect(() => {
  //   (async () => {
  //     const result = await axios.get('./assets/taiwan.json')
  //     console.log(result);
  //     setAddressData(result.data);
  //   })();
  // }, [])
  // <option value="">請選擇縣市</option>
  //               {addressData.map((city) => {
  //                 return <option value={city.CityName} key={city.CityEngName}>{city.CityName}</option>
  //               })}
  

  
  
  return (
    <div style={{marginTop: -1+'rem'}}>
      <div className="full-width-section"
      style={{
        backgroundColor: "black"
        // backgroundImage: `url('/your-image.jpg')`,
        // backgroundSize: "cover",
        // backgroundPosition: "center"
      }}>

        <div className="container py-5 mx-auto allEvents">
          {/* 麵包屑 */}
          <Breadcrumb breadcrumbs={breadcrumb} />

          <div className="row g-0 mt-3">
            <div className="col-md-3 col-12">
              <input type="text" className="form-control-customer form-control bg-dark text-white" placeholder="收尋活動關鍵字"/>
            </div>
            <div className="col-md-2 col-6">
              <select id="inputState1" className="form-control-customer form-select bg-dark text-white">
                <option value="">參加時間</option>
                <option>...</option>
              </select>
            </div>
            <div className="col-md-2 col-6">
              <select id="inputState2" className="form-control-customer form-select bg-dark text-white">
                <option value="">地區</option>
                <option>...</option>
              </select>
            </div>
            <div className="col-md-2 col-6">
              <select id="inputState3" className="form-control-customer form-select bg-dark text-white">
                <option value="">活動類型</option>
                <option>...</option>
              </select>
            </div>
            <div className="col-md-2 col-6">
              <select id="inputState4" className="form-control-customer form-select bg-dark text-white">
                <option value="">票價</option>
                <option>...</option>
              </select>
            </div>
            <div className="col-md-1 col-12">
              <button type="button" className="btn bg-white form-control-customer text-center w-100">收尋</button>
              {/* <span class="input-group-text form-control-customer">收尋</span> */}
            </div>
          </div>
         

        </div>
      </div>
      

    <div className="container">
      {/* 產生活動列表 */}
      <div className="row mt-5">
        <DataTable handleNavigate={handleNavigate}></DataTable>
      </div>
      
      <PaginationComponent
        totalPages={10}
        currentPage={currentPage}
        onPageChange={(page) =>{
          setCurrentPage(page)
          window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
          } 
        }
      />

    </div>




      {loading && (<Loading></Loading>)}  
    </div>
    
  );
}

export default AllEvents;
