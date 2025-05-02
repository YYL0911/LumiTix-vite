
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useMemo, memo } from 'react';

// 元件
import Breadcrumb from "../conponents/Breadcrumb";
import Loading from "../conponents/Loading";
import PaginationComponent from "../conponents/Pagination";

import locationIcon from "../assets/img/location_on.png"
import searchIcon from "../assets/img/Search.png"





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
      <img src={imgSrc} className="img-fluid object-fit-cover w-100 " alt={title} />
    </div>
    <div className="d-flex flex-column justify-content-between mt-3" >
      
      <div className="d-flex justify-content-between text-muted small mb-2 align-items-center">
        <span>{showTime}</span>
        <div className="d-flex align-items-center">
          <img src={locationIcon} alt="icon" className="img-fluid object-fit-cover "/>
          <p className=" m-0 ms-1" >{location}</p>
        </div>
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


  const [locationData, setLocationData] = useState(["全部地區", "台北市","台中市", "高雄市"]);
  const [categoryData, setCategoryData] = useState(["全部種類", "演唱會", "舞台劇", "音樂會"]);
  const [dateData, setDatesData] = useState(["全部時間","今天","一週內","一個月內","兩個月內"]);
  const [priceData, setPriceData] = useState(["全部價格", "免費", "TWD 1-1000", "TWD 1000-2000", "TWD 2000-3000", "TWD 3000 以上"]);

  const [keyword, setKeyword] = useState("");
  const [locationSelect, setLocationSelect] = useState("");
  const [categorySelect, setCategorySelect] = useState("");
  const [dateSelect, setDateSelect] = useState("");
  const [priceSelect, setPriceSelect] = useState("");

  
  const handleSeach = () => {
    
    console.log(locationSelect +" " + categorySelect +" " +dateSelect +" " +priceSelect );
  };
  
  

  return (
    <>
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
              <input type="text" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="form-control-customer form-control bg-dark text-white" 
              placeholder="收尋活動關鍵字"/>
            </div>
            <div className="col-md-2 col-6">
              <select id="inputDate" value={dateSelect} onChange={(e) => setDateSelect(e.target.value)}
              className="form-control-customer form-select bg-dark text-white">
                <option value="" disabled>參加時間</option>
                {dateData.map((item) => {
                  return <option value={item} key={item}>{item}</option>
                })}
              </select>
            </div>
            <div className="col-md-2 col-6">
              <select id="inputLocation"  value={locationSelect} onChange={(e) => setLocationSelect(e.target.value)}
              className="form-control-customer form-select bg-dark text-white">
                <option value="" disabled>地區</option>
                {locationData .map((item) => {
                  return <option value={item} key={item}>{item}</option>
                })}
              </select>
            </div>
            <div className="col-md-2 col-6">
              <select id="inputCategory" value={categorySelect} onChange={(e) => setCategorySelect(e.target.value)}
              className="form-control-customer form-select bg-dark text-white">
                <option value="" disabled>活動類型</option>
                {categoryData.map((item) => {
                  return <option value={item} key={item}>{item}</option>
                })}
              </select>
            </div>
            <div className="col-md-2 col-6">
              <select id="inputPrice" value={priceSelect} onChange={(e) => setPriceSelect(e.target.value)}
              className="form-control-customer form-select bg-dark text-white">
                <option value="" disabled>票價</option>
                {priceData.map((item) => {
                  return <option value={item} key={item}>{item}</option>
                })}
              </select>
            </div>
            <div className="col-md-1 col-12">
              <button className="btn form-control-customer 
              d-flex align-items-center justify-content-center bg-white w-100"
              onClick={handleSeach}>
                <img src={searchIcon} alt="icon" />
                <p className=" m-0 ms-1 d-inline d-md-none" >收尋</p>
              </button>
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
    </>
    
  );
}

export default AllEvents;
