
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef} from 'react';

// 元件
import Breadcrumb from "../conponents/Breadcrumb";
import Loading from "../conponents/Loading";
import PaginationComponent from "../conponents/Pagination";

import locationIcon from "../assets/img/location_on.png"
import searchIcon from "../assets/img/Search.png"
import searchBG from "../assets/img/AlleventsBg.png"

import pic1 from "../assets/img/tmpPic/pic (1).png"
import pic2 from "../assets/img/tmpPic/pic (2).png"
import pic3 from "../assets/img/tmpPic/pic (3).png"
import pic4 from "../assets/img/tmpPic/pic (4).png"
import pic5 from "../assets/img/tmpPic/pic (5).png"
import pic6 from "../assets/img/tmpPic/pic (6).png"
import pic7 from "../assets/img/tmpPic/pic (7).png"
import pic8 from "../assets/img/tmpPic/pic (8).png"
import pic9 from "../assets/img/tmpPic/pic (9).png"


const dataString =  (dateDelt) => {
  const today = new Date();
  const futureDate = new Date(today); // 複製一份
  futureDate.setDate(today.getDate() + dateDelt);
  const yyyy = futureDate.getFullYear();
  const mm = String(futureDate.getMonth() + 1).padStart(2, '0'); // 月份從 0 開始
  const dd = String(futureDate.getDate()).padStart(2, '0');

  return`${yyyy}-${mm}-${dd}`;
}

const daysFromToday = (dateStr, targetDelt) => {
  const today = new Date();
  const targetDate = new Date(dateStr);

  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);


  return  (Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24))) <= targetDelt
}


// 假資料 https://fakeimg.pl/200x290/?text=PICTURE
const sampleData = [
  {
    id: 1,
    imgSrc:pic1,
    title: '鋼琴獨奏會《浪漫派之聲》蕭邦與李斯特',
    showDate: dataString(0),
    showTime:"20:00~20:50",location:"台北市",category:"演唱會"

  },
  {
    id: 2,
    imgSrc:pic2,
    title: 'Moonstruck《月光迷途》音樂旅程',
    showDate:dataString(6),
    showTime:"20:00~20:50",location:"台北市",category:"演唱會"
  },
  {
    id: 3,
    imgSrc:pic3,
    title: 'MOSAIC BAND《色彩爆發》世界巡演',
    showDate: dataString(30),
    showTime:"20:00~20:50",location:"台北市",category:"舞台劇"
  },
  {
    id: 4,
    imgSrc:pic4,
    title: 'Retro Groove《復古風暴》現場演唱會',
    showDate:dataString(7),
    showTime:"20:00~20:50",location:"高雄市",category:"演唱會"
  },
  {
    id: 5,
    imgSrc:pic5,
    title: '夜行少女《無盡之夜》全台巡演',
    showDate:dataString(10),
    showTime:"20:00~20:50",location:"台北市",category:"演唱會"
  },
  {
    id: 6,
    imgSrc:pic6,
    title: '原創戲劇《時光書簡》跨世代親情故事',
    showDate:dataString(60),
    showTime:"20:00~20:50",location:"台中市",category:"音樂會"
  },
  {
    id: 7,
    imgSrc:pic7,
    title: '國樂團《絲竹共鳴》東方韻味特場',
    showDate:dataString(15),
    showTime:"20:00~20:50",location:"台北市",category:"舞台劇"
  },
  {
    id: 8,
    imgSrc:pic8,
    title: '黑色幽默劇《辦公室奇談》人生如戲',
    showDate:dataString(20),
    showTime:"20:00~20:50",location:"高雄市",category:"演唱會"
  },
  {
    id: 9,
    imgSrc:pic9,
    title: '當代戲劇《鏡中謎影》懸疑大戲',
    showDate:dataString(80),
    showTime:"20:00~20:50",location:"台中市",category:"舞台劇"
  }
  
];

// 列表元件
const CardItem = ({ id, imgSrc, title, showTime, location, category, handleNavigate }) => (
  <a className="allEventHover card mb-5 col-md-3 col-6 text-decoration-none" style={{ border: 'none' }} href="#" onClick={(e) => {
    e.preventDefault();
    handleNavigate(`/evevtInfo/${id}`)
  }}>
    
    <div className="allEventImg border border-2 border-secondary ratio" style={{ '--bs-aspect-ratio': '145.78%' }}>
      <img src={imgSrc} className="img-fluid object-fit-cover w-100 h-100 p-2" alt={title} />
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
        <span className=" border-bottom border-top border-danger border-3 p-2" >{category}</span>
      </div>
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
          <h1>無符合資料</h1>
        ) : (
          pageProducts.map((product) => (
            <CardItem
              key={product.id}
              id={product.id}
              imgSrc={product.imgSrc}
              title={product.title}
              showTime={product.showDate}
              location={product.location}
              category={product.category}
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
  { name: '首頁', path: "/" },
  { name: '活動資訊', path: "/personal" },
];


function AllEvents() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  //跳轉頁面
  const handleNavigate = ((path) => navigate(path)); 
  const [apiLoading, setApiLoading] = useState(false);

  const [loading, setloading] = useState(false);
  
  const [totalPages, setTotalPages] = useState(Math.ceil(sampleData.length/8));
  const [currentPage, setCurrentPage] = useState(1);


  const [locationData] = useState([
    "全部地區","臺北市","新北市","桃園市","臺中市","臺南市","高雄市","基隆市","新竹市","嘉義市","新竹縣","苗栗縣","彰化縣","南投縣","雲林縣","嘉義縣","屏東縣","宜蘭縣","花蓮縣","臺東縣","澎湖縣","金門縣","連江縣"
  ]);
  const [categoryData, setCategoryData] = useState(["全部種類", "演唱會", "舞台劇", "音樂會"]);
  const [dateData, setDatesData] = useState(["全部時間","今天","一週內","一個月內","兩個月內"]);
  const [priceData, setPriceData] = useState(["全部價格", "免費", "TWD 1-1000", "TWD 1000-2000", "TWD 2000-3000", "TWD 3000 以上"]);

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || "" );
  const [locationSelect, setLocationSelect] = useState(searchParams.get('location') || "" );
  const [categorySelect, setCategorySelect] = useState(searchParams.get('category') || "" );
  const [dateSelect, setDateSelect] = useState(searchParams.get('date') || "" );
  const [priceSelect, setPriceSelect] = useState(searchParams.get('price') || "" );

  const [filteredProducts, setFilteredProducts] = useState(sampleData);

  useEffect(() => {
    const paramKeyword = searchParams.get('keyword') || "";
    setKeyword(paramKeyword)

    // 每次 URL 中的 location 改變，就觸發這個 useEffect
    const paramLocation = searchParams.get('location') || "";
    if (locationData.includes(paramLocation)) setLocationSelect(paramLocation);
    else setLocationSelect(""); // 預設值
    
    const paramCategory = searchParams.get('category') || "";
    if (categoryData.includes(paramCategory)) setCategorySelect(paramCategory);
    else setCategorySelect(""); // 預設值

    const paramDate = searchParams.get('date') || "";
    if (dateData.includes(paramDate)) setDateSelect(paramDate);
    else setDateSelect(""); // 預設值

    // const paramPrice = searchParams.get('price') || "";
    // if (priceData.includes(paramPrice)) setPriceSelect(paramPrice);
    // else setPriceSelect(""); // 預設值


    // 篩選資料
    let tmpDelt = 0 
    if(paramDate == "一週內") tmpDelt = 7
    else if(paramDate == "一個月內") tmpDelt = 30
    else if(paramDate == "兩個月內") tmpDelt = 60
    
    const result = sampleData.filter((product) => {
      return (
        (paramKeyword === "" || product.title.match(paramKeyword)) &&
        (paramDate === "全部時間" || paramDate === "" || daysFromToday(product.showDate,tmpDelt)) &&
        (paramLocation === "全部地區" || paramLocation === "" || product.location === paramLocation) &&
        (paramCategory === "全部種類" || paramCategory === "" || product.category === paramCategory)
      );
    });
  
    setFilteredProducts(result); // 更新顯示的資料
    if(Math.ceil(result.length/8) < 1) setTotalPages(1)
    else setTotalPages(Math.ceil(result.length/8))

  }, [searchParams]);

  const handleSeach = () => {
    const newParams = new URLSearchParams();
    if (keyword) newParams.set('keyword', keyword);
    if (locationSelect) newParams.set('location', locationSelect);
    if (categorySelect) newParams.set('category', categorySelect);
    if (dateSelect) newParams.set('date', dateSelect);
    setSearchParams(newParams);
    setCurrentPage(1)
  };


  const isFirstRender = useRef(true); // 記錄是否是第一次渲染
  // useEffect(() => {
  //   if (isFirstRender.current) {
      
  //     isFirstRender.current = false; // 更新為 false，代表已執行過
  //     // console.log("✅ useEffect 只執行一次");
  //     // setApiLoading(true)
  //     fetch("",{
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       }}) 
  //       .then(res => res.json())
  //       .then(result => {
  //           console.log(result)
          
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       });
  //   }
  // }, []);
  

  return (
    <>
      <div className="full-width-section"
      style={{
        backgroundImage: `url(${searchBG})`,
        backgroundSize: "cover",    backgroundPosition: "center"
      }}>
        <div className="container py-5 mx-auto allEvents">
          {/* 麵包屑 */}
          <Breadcrumb breadcrumbs={breadcrumb} />

          <div className="row g-0 mt-3">
            <div className="col-md-5 col-12">
              <input type="text" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="form-control-customer form-control bg-dark text-white" 
              placeholder="收尋活動關鍵字"/>
            </div>
            <div className="col-md-2 col-6">
              <select id="inputDate" value={dateSelect} onChange={(e) => setDateSelect(e.target.value)}
              className="form-control-customer form-select bg-dark text-white custom-select-arrow">
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
            <div className="col-md-2 col-12">
              <select id="inputCategory" value={categorySelect} onChange={(e) => setCategorySelect(e.target.value)}
              className="form-control-customer form-select bg-dark text-white">
                <option value="" disabled>活動類型</option>
                {categoryData.map((item) => {
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
          <DataTable 
          filterProducts={filteredProducts}
          handleNavigate={handleNavigate}
          currentPage={currentPage}
          >
          </DataTable>
        </div>
        
        <PaginationComponent
          totalPages={totalPages}
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
