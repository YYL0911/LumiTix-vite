import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Home.scss"; // 首頁樣式匯入
import axios from "axios"; // 用於發送 HTTP 請求的函式庫
import { parseISO, format, addMinutes } from "date-fns"; // 在檔案頂部引入 date-fns 的相關函數
// --- Swiper Core and modules imports ---
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow, A11y } from "swiper/modules"; // 引入需要的模組
// --- Swiper styles imports ---
import "swiper/css"; // 核心樣式
import "swiper/css/navigation"; // 導航箭頭樣式
import "swiper/css/pagination"; // 分頁圓點樣式
import "swiper/css/effect-coverflow"; // Coverflow 效果樣式
// --- 首頁粉塵效果模組 ---
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; // 或 loadFull, loadBasic 等，取決於您安裝的包
// --- Section 1 的 import ---
import searchIcon from "../../assets/img/Search.png";
// --- Section 2 的圖片 import ---
import boltIcon from "../../assets/img/Home/features/bolt.png";
import encryptedIcon from "../../assets/img/Home/features/encrypted.png";
import groupsIcon from "../../assets/img/Home/features/groups.png";
import taiwanMap from "../../assets/img/Home/features/Vector.png";
// --- Section 3 的圖片 import ---
import arrowLeftBlackOnLight from "../../assets/img/Home/carousel/arrow_left_black_on_light.png";
import arrowRightBlackOnLight from "../../assets/img/Home/carousel/arrow_right_black_on_light.png";
// --- Section 4 5 的圖片 import (請將圖片放置於建議路徑或自行修改) ---
import recommendedHeaderIcon from "../../assets/img/Home/recommended/Recommended_Header_Icon.png";
import upcomingHeaderIcon from "../../assets/img/Home/recommended/Upcoming_Header_Icon.png";
import arrowLeftRecommended from "../../assets/img/Home/recommended/arrow_left_white_on_dark.png";
import arrowRightRecommended from "../../assets/img/Home/recommended/arrow_right_white_on_dark.png";
function Home() {
  const { eventTypes } = useAuth();
  const navigate = useNavigate(); // 初始化 useNavigate
  const [particlesInit, setParticlesInit] = useState(false); // 來追蹤粉塵效果引擎是否已初始化
  // 放在 Home 組件外部或內部均可，如果不需要動態改變，放外部更佳
  const heroParticlesOptions = {
    fpsLimit: 60, // 限制 FPS，有助於性能
    interactivity: {
      events: {
        onClick: {
          // 可選：點擊時的效果
          enable: true,
          mode: "push", // 推出一些粒子
        },
      },
      modes: {
        repulse: {
          distance: 60, // 散開的距離
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: "#ffffff", // 粒子顏色 (白色)
      },
      links: {
        enable: false, // 粒子間的連接線，粉塵效果通常不需要
      },
      move: {
        enable: true,
        direction: "none", // 隨機方向飄動
        speed: 0.3, // 飄動速度 (設定慢一點，營造漂浮感)
        random: true, // 啟用隨機移動
        straight: false, // 非直線移動，更自然
        outModes: {
          // 粒子移出畫布邊界時的行為
          default: "out", // "out": 移出後消失 (然後新的會產生)
        },
      },
      number: {
        // 粒子數量
        density: {
          enable: true,
          area: 1000, // 密度計算區域，值越大，在相同 value 下粒子越稀疏
        },
        value: 2000, // 基礎粒子數量，可調整
      },
      opacity: {
        // 粒子透明度
        value: { min: 0.1, max: 0.6 }, // 隨機透明度，增加層次感
        animation: {
          // 透明度動畫 (可選)
          enable: true,
          speed: 0.5,
          minimumValue: 0.1,
          sync: false,
        },
      },
      shape: {
        type: "circle", // 粒子形狀
      },
      size: {
        // 粒子大小
        value: { min: 0.5, max: 1.0 }, // 隨機大小，讓粒子更自然
        animation: {
          // 大小動畫 (可選)
          enable: true,
          speed: 2,
          minimumValue: 0.3,
          sync: false,
        },
      },
    },
    detectRetina: true, // 為高 DPI (Retina) 螢幕優化
  };
  // --- 狀態管理和資料 ---
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
  // const [categoryData] = useState(["全部種類", "演唱會", "舞台劇", "音樂會"]);
  const [dateData] = useState(["全部時間", "今天", "一週內", "一個月內", "兩個月內"]);
  const [keyword, setKeyword] = useState("");
  const [locationSelect, setLocationSelect] = useState(""); // 初始為空，代表未選擇
  const [categorySelect, setCategorySelect] = useState(""); // 初始為空
  const [dateSelect, setDateSelect] = useState(""); // 初始為空
  // --- Section 3 (大型輪播) 的狀態 ---
  const [carouselSlides, setCarouselSlides] = useState([]);
  // --- Section 4 (熱門推薦) 的狀態 ---
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [errorRecommended, setErrorRecommended] = useState(null);
  // --- Section 5 (即將登場) 的狀態 ---
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [errorUpcoming, setErrorUpcoming] = useState(null);

  // 新增 useEffect 用於初始化粒子引擎
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine); // 如果您安裝的是 @tsparticles/slim
    }).then(() => {
      setParticlesInit(true); // 初始化完成後，設定 state
    });
  }, []); // 空依賴陣列，確保只在組件掛載時執行一次

  const handleSearch = (event) => {
    event.preventDefault();
    const newParams = new URLSearchParams();
    if (keyword) {
      newParams.set("keyword", keyword);
    }
    // 如果使用者未選擇 (state 為空字串)，則傳遞對應的「全部」選項值
    newParams.set("date", dateSelect || "全部時間");
    newParams.set("location", locationSelect || "全部地區");
    newParams.set("category", categorySelect || "全部種類");
    navigate(`/allEvents?${newParams.toString()}`);
  };
  useEffect(() => {
    const fetchRecommendedAndCarouselEvents = async () => {
      // 合併獲取熱門推薦和輪播資料
      setLoadingRecommended(true); // 同時作為輪播的載入指示
      setErrorRecommended(null); // 重置錯誤狀態
      try {
        const response = await axios.get("https://n7-backend.onrender.com/api/v1/events/trend");
        if (response.data && response.data.status && Array.isArray(response.data.data)) {
          const mappedTrendEvents = response.data.data.map((apiEvent) => {
            // --- 使用 date-fns 進行時間格式化 ---
            const dateObj = parseISO(apiEvent.start_at); // 1. 解析 ISO 字串
            // 2. 調整 Date 物件，確保後續 format 函數能正確提取出原始 UTC 日期對應的年月日
            const dateAdjustedForUtcDisplay = addMinutes(dateObj, dateObj.getTimezoneOffset());
            // 3. 格式化調整後的日期物件為 'yyyy-MM-dd'
            const formattedDate = format(dateAdjustedForUtcDisplay, "yyyy-MM-dd"); // 修改格式化字串
            // --- 時間格式化結束 ---
            return {
              id: apiEvent.id,
              img: apiEvent.cover_image_url,
              date: formattedDate, // 使用 'yyyy-MM-dd' 格式
              location: apiEvent.city,
              title: apiEvent.title,
              category: apiEvent.type,
              view_count: apiEvent.view_count,
            };
          });
          setRecommendedEvents(mappedTrendEvents); // 設定 Section 4 的資料
          // 從已排序的熱門推薦中選取前五名作為 Section 3 輪播資料
          // 確保這些欄位符合 renderCarouselSection 中 SwiperSlide 的需求
          const topThreeForCarousel = mappedTrendEvents.slice(0, 5);
          setCarouselSlides(topThreeForCarousel);
        } else {
          const errorMsg = response.data.message || "無法取得熱門/輪播活動資料，回應格式不符。";
          setErrorRecommended(errorMsg); // 同時影響 Section 3 和 4
          setRecommendedEvents([]);
          setCarouselSlides([]);
        }
      } catch (error) {
        console.error("Error fetching recommended/carousel (trend) events:", error);
        let specificErrorMsg = "讀取熱門/輪播活動時發生未知錯誤。";
        if (error.response && error.response.data && error.response.data.message) {
          specificErrorMsg = error.response.data.message;
        } else if (error.request) {
          specificErrorMsg = "無法連線至伺服器(熱門/輪播)，請檢查網路。";
        }
        setErrorRecommended(specificErrorMsg); // 同時影響 Section 3 和 4
        setRecommendedEvents([]);
        setCarouselSlides([]);
      } finally {
        setLoadingRecommended(false); // Section 3 和 4 的載入都結束
      }
    };

    const fetchUpcomingEvents = async () => {
      setLoadingUpcoming(true);
      setErrorUpcoming(null);
      try {
        const response = await axios.get("https://n7-backend.onrender.com/api/v1/events/coming-soon");
        // axios 會將成功的 JSON 回應直接放在 response.data
        if (response.data && response.data.status && Array.isArray(response.data.data)) {
          const mappedEvents = response.data.data.map((event) => {
            // --- 使用 date-fns 進行時間格式化 ---
            const dateObj = parseISO(event.start_at); // 1. 解析 ISO 字串
            // 2. 調整 Date 物件，確保後續 format 函數能正確提取出原始 UTC 日期對應的年月日
            const dateAdjustedForUtcDisplay = addMinutes(dateObj, dateObj.getTimezoneOffset());
            // 3. 格式化調整後的日期物件為 'yyyy-MM-dd'
            const formattedDate = format(dateAdjustedForUtcDisplay, "yyyy-MM-dd"); // 修改格式化字串
            // --- 時間格式化結束 ---
            return {
              id: event.id,
              img: event.cover_image_url,
              date: formattedDate, // 使用 'yyyy-MM-dd' 格式
              location: event.city,
              title: event.title,
              category: event.type,
            };
          });
          setUpcomingEvents(mappedEvents);
        } else {
          // 即使 HTTP 狀態是 200，但如果 API 回應的 status: false 或 data 格式不符
          throw new Error(response.data.message || "無法取得即將登場活動的資料，回應格式不符。");
        }
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
        if (error.response && error.response.data && error.response.data.message) {
          // 後端回傳的錯誤 (例如您提供的 500 錯誤 JSON)
          setErrorUpcoming(error.response.data.message);
        } else if (error.request) {
          // 請求已發出，但沒有收到回應 (網路問題)
          setErrorUpcoming("無法連線至伺服器，請檢查您的網路連線。");
        } else {
          // 設定請求時發生錯誤或其他未知錯誤
          setErrorUpcoming("讀取活動時發生未知錯誤，請稍後再試。");
        }
        setUpcomingEvents([]); // 清空資料
      } finally {
        setLoadingUpcoming(false);
      }
    };

    fetchRecommendedAndCarouselEvents();
    fetchUpcomingEvents();
  }, []); // 空依賴陣列，只在掛載時執行

  // --- 狀態管理和資料結束 ---
  // --- Section 1: 搜尋列 ---
  const renderHeroSection = () => {
    return (
      <section className="hero-section">
        {particlesInit && ( // 只有在引擎初始化完成後才渲染 Particles 組件
          <Particles
            id="tsparticles-hero-background" // 給它一個唯一的 ID
            options={heroParticlesOptions} // 傳入您的設定檔
            className="hero-particles-canvas"
          />
        )}
        <div
          className="container d-flex flex-column justify-content-center align-items-center hero-content-container"
          style={{ minHeight: "70vh" }}
        >
          <p className="hero-subtitle">即刻玩賞台灣藝文</p>
          <form className="w-100" onSubmit={handleSearch}>
            <div className="row g-0 mt-3 search-row">
              {/* 關鍵字輸入 - 調整欄寬以適應移除價格後的佈局 */}
              <div className="col-md-5 col-12">
                <input
                  type="text"
                  className="form-control-customer form-control bg-dark text-white"
                  placeholder="搜尋活動關鍵字"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              {/* 參加時間 */}
              <div className="col-md-2 col-sm-4 col-6">
                <select
                  className="form-control-customer form-select bg-dark text-white"
                  value={dateSelect}
                  onChange={(e) => setDateSelect(e.target.value)}
                >
                  <option value="" disabled>
                    參加時間
                  </option>
                  {dateData.map((item) => (
                    <option value={item} key={`date-${item}`}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              {/* 地區 */}
              <div className="col-md-2 col-sm-4 col-6">
                <select
                  className="form-control-customer form-select bg-dark text-white"
                  value={locationSelect}
                  onChange={(e) => setLocationSelect(e.target.value)}
                >
                  <option value="" disabled>
                    地區
                  </option>
                  {locationData.map((item) => (
                    <option value={item} key={`loc-${item}`}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              {/* 活動類型 */}
              <div className="col-md-2 col-sm-4 col-12">
                <select
                  className="form-control-customer form-select bg-dark text-white"
                  value={categorySelect}
                  onChange={(e) => setCategorySelect(e.target.value)}
                >
                  <option value="" disabled>
                    活動類型
                  </option>
                  {eventTypes.map((item) => (
                    <option value={item.name} key={`cat-${item.name}`}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* 搜尋按鈕 */}
              <div className="col-md-1 col-12">
                <button
                  type="submit"
                  className="btn form-control-customer d-flex align-items-center justify-content-center bg-white w-100"
                >
                  <img src={searchIcon} alt="搜尋" />
                  <p className="m-0 ms-1 d-inline d-md-none">搜尋</p>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    );
  };
  // --- Section 2: 為什麼選擇我們 ---
  const renderWhyChooseUsSection = () => {
    // 內容定義 (保持不變)
    const titleContent = { title: "為什麼<br />選擇我們" };
    const securityContent = { icon: encryptedIcon, title: "安全可靠", text: "確保交易安全，提供無憂的購票體驗。" };
    const efficiencyContent = { icon: boltIcon, title: "便捷與高效", text: "一站式票務服務，簡單快速完成購票與管理。" };
    const audienceContent = {
      icon: groupsIcon,
      title: "連結藝文與觀眾",
      text: "幫助活動主辦方拓展影響力，讓更多人輕鬆參與藝文展演。",
    };
    const mapContent = {
      isMap: true,
      icon: taiwanMap,
      title: "專為台灣市場設計",
      text: "深入了解本地藝文活動需求，打造最適合台灣的票務平台。",
    };

    return (
      <section className="why-choose-us-section py-5">
        <div className="container">
          <div className="row g-0">
            {/* 外層 Row */}
            {/* 左欄：標題區塊 */}
            <div className="col-lg-4 col-12 why-choose-us-title-col-alt p-4 d-flex align-items-center text-start">
              <h2 className="mb-0" dangerouslySetInnerHTML={{ __html: titleContent.title }}></h2>
            </div>
            {/* 右欄：包含 2x2 網格 */}
            <div className="col-lg-8 col-12">
              {/* 內部網格容器 */}
              <div className="row g-0 d-flex flex-wrap">
                <div className="col-lg-6 col-6 why-choose-us-feature-col p-4 d-flex flex-column">
                  <img
                    src={efficiencyContent.icon}
                    alt={efficiencyContent.title}
                    className="feature-icon mb-3 align-self-start"
                  />
                  <h5 className="fw-bold text-start">{efficiencyContent.title}</h5>
                  <p className="small text-muted text-start">{efficiencyContent.text}</p>
                </div>
                {/* Security Block */}
                <div className="col-lg-6 col-6 why-choose-us-feature-col p-4 d-flex flex-column">
                  <img
                    src={securityContent.icon}
                    alt={securityContent.title}
                    className="feature-icon mb-3 align-self-start"
                  />
                  <h5 className="fw-bold text-start">{securityContent.title}</h5>
                  <p className="small text-muted text-start">{securityContent.text}</p>
                </div>
                {/* Audience Block */}
                <div className="col-lg-6 col-6 why-choose-us-feature-col p-4 d-flex flex-column">
                  <img
                    src={audienceContent.icon}
                    alt={audienceContent.title}
                    className="feature-icon mb-3 align-self-start"
                  />
                  <h5 className="fw-bold text-start">{audienceContent.title}</h5>
                  <p className="small text-muted text-start">{audienceContent.text}</p>
                </div>
                {/* Map Block */}
                <div className="col-lg-6 col-6 why-choose-us-feature-col p-4 d-flex flex-column">
                  <img src={mapContent.icon} alt={mapContent.title} className="feature-icon mb-3 align-self-start" />
                  <h5 className="fw-bold text-start">{mapContent.title}</h5>
                  <p className="small text-muted text-start">{mapContent.text}</p>
                </div>
              </div>{" "}
              {/* 內部網格容器結束 */}
            </div>{" "}
            {/* 右欄結束 */}
          </div>
        </div>
      </section>
    );
  };
  // --- Section 3: 大型輪播區塊 ---
  const renderCarouselSection = () => {
    // Section 3 的載入和錯誤狀態可以依賴 Section 4 (loadingRecommended, errorRecommended)
    if (loadingRecommended) {
      // 使用 loadingRecommended 作為輪播的載入指示
      return (
        <section className="carousel-section py-5">
          <div className="container text-center py-5">
            <p>載入輪播中，請稍候...</p>
          </div>
        </section>
      );
    }

    if (errorRecommended) {
      // 使用 errorRecommended 作為輪播的錯誤指示
      return (
        <section className="carousel-section py-5">
          <div className="container text-center text-danger py-5">
            <p>讀取輪播活動時發生錯誤：{errorRecommended}</p>
          </div>
        </section>
      );
    }

    if (!carouselSlides || carouselSlides.length === 0) {
      return (
        <section className="carousel-section py-5">
          <div className="container text-center py-5">
            <p>目前沒有輪播活動。</p>
          </div>
        </section>
      );
    }

    return (
      <section className="carousel-section py-5">
        <Swiper
          modules={[Navigation, Pagination, EffectCoverflow, A11y]}
          loop={true}
          grabCursor={true}
          pagination={{ clickable: true, el: ".swiper-custom-pagination" }}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          a11y={{
            prevSlideMessage: "Previous slide",
            nextSlideMessage: "Next slide",
          }}
          breakpoints={{
            320: {
              effect: "slide",
              slidesPerView: 1,
              spaceBetween: 15,
              centeredSlides: carouselSlides.length === 1, // 只有一張時置中
            },
            768: {
              effect: "coverflow",
              slidesPerView: "auto", // Coverflow 通常用 auto 或固定數量如 2 或 3
              centeredSlides: true,
              spaceBetween: 30,
              coverflowEffect: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              },
            },
          }}
          className="home-main-carousel"
        >
          {carouselSlides.map(
            (
              slide // 使用 carouselSlides state
            ) => (
              <SwiperSlide
                key={slide.id}
                className="carousel-slide"
                onClick={() => navigate(`/eventInfo/${slide.id}`)}
                style={{ cursor: "pointer" }}
              >
                <img src={slide.img} alt={slide.title} className="carousel-slide-img" />
                <div className="carousel-slide-content p-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="slide-date small">{slide.date}</span>
                    <span className="slide-location small d-flex align-items-center">
                      <i className="bi bi-geo-alt-fill me-1"></i>
                      {slide.location}
                    </span>
                  </div>
                  <div className="slide-title-category-wrapper d-flex justify-content-between mb-3">
                    <h5 className="slide-title mb-2 text-start">{slide.title}</h5>
                    {/* 確保 slide.category 存在且有值才顯示 */}
                    {slide.category && <span className="slide-category">{slide.category}</span>}
                  </div>
                </div>
              </SwiperSlide>
            )
          )}
        </Swiper>
        {/* 自訂導航按鈕和分頁 (只有在有輪播項目時顯示) */}
        {carouselSlides.length > 0 && (
          <div className="swiper-controls container mt-3 d-flex justify-content-center align-items-center">
            <div className="swiper-button-prev-custom me-3">
              <img src={arrowLeftBlackOnLight} alt="上一張" />
            </div>
            <div className="swiper-custom-pagination"></div> {/* 分頁容器 */}
            <div className="swiper-button-next-custom ms-3">
              <img src={arrowRightBlackOnLight} alt="下一張" />
            </div>
          </div>
        )}
      </section>
    );
  };
  // --- Section 4: 熱門推薦 ---
  const renderRecommendedSection = () => {
    if (loadingRecommended) {
      return (
        <section className="recommended-section py-0 position-relative">
          <div className="border p-3 border-secondary position-relative z-1">
            <div className="container d-flex align-items-center justify-content-between">
              <h2 className="section-title mb-0">熱門推薦</h2>
              <img src={recommendedHeaderIcon} alt="熱門推薦圖示" className="section-title-icon" />
            </div>
          </div>
          <div className="container py-4 text-center">
            <p>載入中，請稍候...</p>
          </div>
        </section>
      );
    }

    if (errorRecommended) {
      return (
        <section className="recommended-section py-0 position-relative">
          <div className="border p-3 border-secondary position-relative z-1">
            <div className="container d-flex align-items-center justify-content-between">
              <h2 className="section-title mb-0">熱門推薦</h2>
              <img src={recommendedHeaderIcon} alt="熱門推薦圖示" className="section-title-icon" />
            </div>
          </div>
          <div className="container py-4 text-center text-danger">
            <p>讀取熱門推薦時發生錯誤：{errorRecommended}</p>
            <p>請稍後再試或聯絡客服人員。</p>
          </div>
        </section>
      );
    }

    if (!recommendedEvents || recommendedEvents.length === 0) {
      return (
        <section className="recommended-section py-0 position-relative">
          <div className="border p-3 border-secondary position-relative z-1">
            <div className="container d-flex align-items-center justify-content-between">
              <h2 className="section-title mb-0">熱門推薦</h2>
              <img src={recommendedHeaderIcon} alt="熱門推薦圖示" className="section-title-icon" />
            </div>
          </div>
          <div className="container py-4 text-center">
            <p>目前沒有熱門推薦的活動。</p>
          </div>
        </section>
      );
    }

    return (
      <section className="recommended-section py-0 position-relative">
        {/* 上方標題區 */}
        <div className="border p-3 border-secondary position-relative z-1">
          <div className="container d-flex align-items-center justify-content-between">
            <h2 className="section-title mb-0">熱門推薦</h2>
            <img src={recommendedHeaderIcon} alt="熱門推薦圖示" className="section-title-icon" />
          </div>
        </div>
        {/* Swiper 區塊 */}
        <div className="container position-relative z-1 py-4">
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            loop={true}
            grabCursor={true}
            pagination={{ clickable: true, el: ".swiper-pagination-recommended" }}
            navigation={{
              nextEl: ".swiper-button-next-recommended",
              prevEl: ".swiper-button-prev-recommended",
            }}
            a11y={{
              prevSlideMessage: "上一組推薦",
              nextSlideMessage: "下一組推薦",
            }}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 20, centeredSlides: true },
              768: { slidesPerView: 2, spaceBetween: 20, centeredSlides: false },
              992: { slidesPerView: 4, spaceBetween: 30, centeredSlides: false },
            }}
            className="recommended-swiper"
          >
            {recommendedEvents.map((event) => (
              <SwiperSlide key={event.id} className="recommended-slide">
                <a
                  href={`/eventInfo/${event.id}`} // 提供一個有效的 href，對 SEO 友好
                  onClick={(e) => {
                    e.preventDefault(); // 阻止預設跳轉
                    navigate(`/eventInfo/${event.id}`); // 使用 React Router 導航
                  }}
                  style={{ textDecoration: "none", display: "block" }} // 移除底線並讓 <a> 表現得像區塊
                >
                  <div className="event-card mt-5">
                    {/* 注意 Section 4 的卡片有 mt-5 */}
                    <div className="event-card-img-wrapper">
                      <img src={event.img} alt={event.title} className="event-card-main-img" />
                    </div>
                    <div className="event-card-content">
                      <div className="event-card-info-top d-flex justify-content-between align-items-center">
                        <span className="event-date">{event.date}</span>
                        <span className="event-location d-flex align-items-center">
                          <i className="bi bi-geo-alt-fill me-1"></i>
                          {event.location}
                        </span>
                      </div>
                      <h4 className="event-title mt-2 mb-2">{event.title}</h4>
                      {/* 根據 API 是否有分類欄位以及您的決定來調整此處 */}
                      {event.category && <span className="event-category-tag">{event.category}</span>}
                    </div>
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* Swiper 控制按鈕與分頁 */}
        {recommendedEvents.length > 0 && (
          <div className="swiper-controls-recommended mb-5 d-flex justify-content-center align-items-center">
            {/* ... 控制按鈕 JSX 維持不變 ... */}
            <div className="swiper-button-prev-recommended me-3">
              <img src={arrowLeftRecommended} alt="上一個" />
            </div>
            <div className="swiper-pagination-recommended"></div>
            <div className="swiper-button-next-recommended ms-3">
              <img src={arrowRightRecommended} alt="下一個" />
            </div>
          </div>
        )}
      </section>
    );
  };
  // --- Section 5: 即將登場 ---
  const renderUpcomingSection = () => {
    if (loadingUpcoming) {
      return (
        <section className="upcoming-section py-0 position-relative">
          <div className="border my-5 p-3 border-secondary position-relative z-1">
            <div className="container d-flex align-items-center justify-content-between">
              <h2 className="section-title mb-0">即將登場</h2>
              <img src={upcomingHeaderIcon} alt="即將登場圖示" className="section-title-icon" />
            </div>
          </div>
          <div className="container py-4 text-center">
            <p>載入中，請稍候...</p>
          </div>
        </section>
      );
    }

    if (errorUpcoming) {
      return (
        <section className="upcoming-section py-0 position-relative">
          <div className="border my-5 p-3 border-secondary position-relative z-1">
            <div className="container d-flex align-items-center justify-content-between">
              <h2 className="section-title mb-0">即將登場</h2>
              <img src={upcomingHeaderIcon} alt="即將登場圖示" className="section-title-icon" />
            </div>
          </div>
          <div className="container py-4 text-center text-danger">
            <p>讀取活動時發生錯誤：{errorUpcoming}</p>
            <p>請稍後再試或聯絡客服人員。</p>
          </div>
        </section>
      );
    }

    if (!upcomingEvents || upcomingEvents.length === 0) {
      return (
        <section className="upcoming-section py-0 position-relative">
          <div className="border my-5 p-3 border-secondary position-relative z-1">
            <div className="container d-flex align-items-center justify-content-between">
              <h2 className="section-title mb-0">即將登場</h2>
              <img src={upcomingHeaderIcon} alt="即將登場圖示" className="section-title-icon" />
            </div>
          </div>
          <div className="container py-4 text-center">
            <p>目前沒有即將登場的活動。</p>
          </div>
        </section>
      );
    }

    return (
      <section className="upcoming-section py-0 position-relative">
        <div className="border my-5 p-3 border-secondary position-relative z-1">
          <div className="container d-flex align-items-center justify-content-between">
            <h2 className="section-title mb-0">即將登場</h2>
            <img src={upcomingHeaderIcon} alt="即將登場圖示" className="section-title-icon" />
          </div>
        </div>
        <div className="container position-relative z-1 py-4">
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            loop={false} // 假設 slidesPerView@992px 是 4
            grabCursor={true}
            pagination={{ clickable: true, el: ".swiper-pagination-upcoming" }}
            navigation={{
              nextEl: ".swiper-button-next-upcoming",
              prevEl: ".swiper-button-prev-upcoming",
            }}
            a11y={{ prevSlideMessage: "上一組推薦", nextSlideMessage: "下一組推薦" }}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 0, centeredSlides: true },
              768: { slidesPerView: 2, spaceBetween: 0, centeredSlides: false },
              992: { slidesPerView: 4, spaceBetween: 0, centeredSlides: false },
            }}
            className="upcoming-swiper"
          >
            {upcomingEvents.map((event) => (
              <SwiperSlide key={event.id} className="upcoming-slide">
                <a
                  href={`/eventInfo/${event.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/eventInfo/${event.id}`);
                  }}
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <div className="event-card">
                    <div className="event-card-img-wrapper">
                      <img src={event.img} alt={event.title} className="event-card-main-img" />
                    </div>
                    <div className="event-card-content">
                      <div className="event-card-info-top d-flex justify-content-between align-items-center">
                        <span className="event-date">{event.date}</span>
                        <span className="event-location d-flex align-items-center">
                          <i className="bi bi-geo-alt-fill me-1"></i>
                          {event.location}
                        </span>
                      </div>
                      <h4 className="event-title mt-2 mb-2">{event.title}</h4>
                      <span className="event-category-tag">{event.category}</span>
                    </div>
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {upcomingEvents.length > 0 && (
          <div className="swiper-controls-upcoming mb-5 d-flex justify-content-center align-items-center">
            <div className="swiper-button-prev-upcoming me-3">
              <img src={arrowLeftRecommended} alt="上一個" />
            </div>
            <div className="swiper-pagination-upcoming"></div>
            <div className="swiper-button-next-upcoming ms-3">
              <img src={arrowRightRecommended} alt="下一個" />
            </div>
          </div>
        )}
      </section>
    );
  };

  return (
    <>
      {renderHeroSection()}
      {renderWhyChooseUsSection()}
      {renderCarouselSection()}
      {renderRecommendedSection()}
      {renderUpcomingSection()}
    </>
  );
}

export default Home;
