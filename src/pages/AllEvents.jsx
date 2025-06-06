
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef} from 'react';

// Context
import { useAuth } from '../contexts/AuthContext';

// 元件
import Breadcrumb from "../conponents/Breadcrumb";
import Loading from "../conponents/Loading";
import PaginationComponent from "../conponents/Pagination";

import locationIcon from "../assets/img/location_on.png"
import searchIcon from "../assets/img/Search.png"
import searchBG from "../assets/img/AlleventsBg.png"


const daysFromToday = (dateStr, targetDelt) => {
  const today = new Date();
  const targetDate = new Date(dateStr);
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  return  (Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24))) <= targetDelt
}


// 列表元件
const CardItem = ({ id, imgSrc, title, showTime, location, category, handleNavigate }) => (
  <a className="allEventHover card mb-5 col-md-3 col-6 text-decoration-none" style={{ border: 'none' }} href="#" onClick={(e) => {
    e.preventDefault();
    handleNavigate(`/eventInfo/${id}`)
  }}>
    
    <div className="allEventImg border border-2 border-secondary ratio" style={{ '--bs-aspect-ratio': '145.78%' }}>
      <img src={imgSrc} className="img-fluid object-fit-cover w-100 h-100 p-2" alt={title} />
    </div>
    <div className="d-flex flex-column justify-content-between mt-3" >
      
      <div className="d-flex justify-content-between text-muted small mb-2 align-items-center">
        <span>{showTime.substring(0,10)|| "" }</span>
        <div className="d-flex align-items-center">
          <img src={locationIcon} alt="icon" className="img-fluid object-fit-cover "/>
          <p className=" m-0 ms-1" >{location}</p>
        </div>
      </div>

      <div className="fw-bold text-black mb-3">{title}</div>
      
    </div>

    <div className="mt-auto pt-2" >
      <span className=" border-bottom border-top border-danger border-3 p-2" >{category}</span>
    </div>
  </a>

);

// 製造表演列表
const DataTable = ({ filterProducts, handleNavigate, currentPage }) => {
  const pageSize = 8;
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;

  const pageProducts = filterProducts.slice(start, end);

  return (
    <>
      {
        pageProducts.length === 0 ? (
          currentPage==0 ? "" : <h1>無符合資料</h1>) 
        : (
          pageProducts.map((product) => (
            <CardItem
              key={product.id}
              id={product.id}
              imgSrc={product.cover_image_url}
              title={product.title}
              showTime={product.start_at}
              location={product.city}
              category={product.type}
              handleNavigate={handleNavigate}
            />
          ))
        )
      }
    </>
  );
};


// 麵包屑
const breadcrumb = [
  { name: "首頁", path: "/" },
  { name: "活動資訊", path: "/allEvents" }, // 確認路徑與 App.jsx 中定義的一致
];


function AllEvents() {
  const { loading, eventTypes } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  //跳轉頁面
  const handleNavigate = (path) => navigate(path);
  const [apiLoading, setApiLoading] = useState(false);

  const [sampleData, setSampleData] = useState([]);

  const [totalPages, setTotalPages] = useState(Math.ceil(sampleData.length / 8));
  const [currentPage, setCurrentPage] = useState(0);

  const [locationData] = useState([
    "全部地區",
    "台北市",
    "新北市",
    "桃園市",
    "台中市",
    "台南市",
    "高雄市",
    "基隆市",
    "新竹市",
    "嘉義市",
    "新竹縣",
    "苗栗縣",
    "彰化縣",
    "南投縣",
    "雲林縣",
    "嘉義縣",
    "屏東縣",
    "宜蘭縣",
    "花蓮縣",
    "台東縣",
    "澎湖縣",
    "金門縣",
    "連江縣",
  ]);
  const [dateData, setDatesData] = useState(["全部時間", "今天", "一週內", "一個月內", "兩個月內"]);

  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [locationSelect, setLocationSelect] = useState(searchParams.get("location") || "");
  const [categorySelect, setCategorySelect] = useState(searchParams.get("category") || "");
  const [dateSelect, setDateSelect] = useState(searchParams.get("date") || "");

  const [filteredProducts, setFilteredProducts] = useState(sampleData);

  useEffect(() => {
    const paramKeyword = searchParams.get("keyword") || "";
    setKeyword(paramKeyword);

    // 每次 URL 中的 location 改變，就觸發這個 useEffect
    const paramLocation = searchParams.get("location") || "";
    if (locationData.includes(paramLocation)) setLocationSelect(paramLocation);
    else setLocationSelect(""); // 預設值

    const paramCategory = searchParams.get("category") || "";
    if (eventTypes.some(item => item.name == paramCategory)) setCategorySelect(paramCategory);
    else{
      setCategorySelect(""); // 預設值
    } 

    const paramDate = searchParams.get("date") || "";
    if (dateData.includes(paramDate)) setDateSelect(paramDate);
    else setDateSelect(""); // 預設值

    // 篩選資料
    let tmpDelt = 0;
    if (paramDate == "一週內") tmpDelt = 7;
    else if (paramDate == "一個月內") tmpDelt = 30;
    else if (paramDate == "兩個月內") tmpDelt = 60;

    
    const result = sampleData.filter((product) => {
      return (
        (paramKeyword === "" || product.title.match(paramKeyword)) &&
        (paramDate === "全部時間" || paramDate === "" || daysFromToday(product.start_at.substring(0, 10), tmpDelt)) &&
        (paramLocation === "全部地區" || paramLocation === "" || product.city === paramLocation) &&
        (paramCategory === "全部種類" || paramCategory === "" || product.type === paramCategory)
      );
    });

    setFilteredProducts(result); // 更新顯示的資料
    if (Math.ceil(result.length / 8) < 1) setTotalPages(1);
    else setTotalPages(Math.ceil(result.length / 8));
  }, [searchParams, sampleData, apiLoading, eventTypes]); // 原為 [searchParams]

  const handleSeach = () => {
    const newParams = new URLSearchParams();
    if (keyword) newParams.set("keyword", keyword);
    if (locationSelect) newParams.set("location", locationSelect);
    if (categorySelect) newParams.set("category", categorySelect);
    if (dateSelect) newParams.set("date", dateSelect);
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  const isFirstRender = useRef(true); // 記錄是否是第一次渲染
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // 更新為 false，代表已執行過
      // console.log("✅ useEffect 只執行一次");
      setApiLoading(true);
      fetch("https://n7-backend.onrender.com/api/v1/events", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((result) => {
          setApiLoading(false);
          setSampleData(result.data);
          setTotalPages(Math.ceil(result.data.length / 8));
          setFilteredProducts(result.data);
          setCurrentPage(1);
        })
        .catch((err) => {
          navigate("/ErrorPage")
        });
    }
  }, []);


  return (
    <>
      <div
        className="full-width-section"
        style={{
          backgroundImage: `url(${searchBG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container py-5 mx-auto allEvents">
          {/* 麵包屑 */}
          <Breadcrumb breadcrumbs={breadcrumb} />

          <div className="row g-0 mt-3">
            <div className="col-md-5 col-12">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="form-control-customer form-control bg-dark text-white"
                placeholder="搜尋活動關鍵字"
              />
            </div>
            <div className="col-md-2 col-6">
              <select
                id="inputDate"
                value={dateSelect}
                onChange={(e) => setDateSelect(e.target.value)}
                className="form-control-customer form-select bg-dark text-white custom-select-arrow"
              >
                <option value="" disabled>
                  參加時間
                </option>
                {dateData.map((item) => {
                  return (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="col-md-2 col-6">
              <select
                id="inputLocation"
                value={locationSelect}
                onChange={(e) => setLocationSelect(e.target.value)}
                className="form-control-customer form-select bg-dark text-white"
              >
                <option value="" disabled>
                  地區
                </option>
                {locationData.map((item) => {
                  return (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="col-md-2 col-12">
              <select
                id="inputCategory"
                value={categorySelect}
                onChange={(e) => setCategorySelect(e.target.value)}
                className="form-control-customer form-select bg-dark text-white"
              >
                <option value="" disabled>
                  活動類型
                </option>
                {eventTypes.map((item) => {
                  return (
                    <option value={item.name} key={item.name}>
                       {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="col-md-1 col-12">
              <button
                className="btn form-control-customer 
              d-flex align-items-center justify-content-center bg-white w-100"
                onClick={handleSeach}
              >
                <img src={searchIcon} alt="icon" />
                <p className=" m-0 ms-1 d-inline d-md-none">搜尋</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* 產生活動列表 */}
        <div className="row mt-5">
          <DataTable
            filterProducts={filteredProducts}
            handleNavigate={handleNavigate}
            currentPage={currentPage}
          ></DataTable>
        </div>

        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        />
      </div>

      {!loading && apiLoading && <Loading></Loading>}
    </>
  );
}

export default AllEvents;
