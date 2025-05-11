import React, { useState } from "react";
import "./Home.scss"; // 首頁樣式匯入
// --- Swiper Core and modules imports ---
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow, A11y } from "swiper/modules"; // 引入需要的模組
// --- Swiper styles imports ---
import "swiper/css"; // 核心樣式
import "swiper/css/navigation"; // 導航箭頭樣式
import "swiper/css/pagination"; // 分頁圓點樣式
import "swiper/css/effect-coverflow"; // Coverflow 效果樣式
// --- Section 1 的 import ---
import searchIcon from "../../assets/img/Search.png";
// --- Section 2 的圖片 import ---
import boltIcon from "../../assets/img/Home/features/bolt.png";
import encryptedIcon from "../../assets/img/Home/features/encrypted.png";
import groupsIcon from "../../assets/img/Home/features/groups.png";
import taiwanMap from "../../assets/img/Home/features/Vector.png";
// --- Section 3 的圖片 import ---
import carouselImg1 from "../../assets/img/Home/carousel/carousel-01.png";
import carouselImg2 from "../../assets/img/Home/carousel/carousel-02.png";
import carouselImg3 from "../../assets/img/Home/carousel/carousel-03.png";
import carouselImg4 from "../../assets/img/Home/carousel/carousel-04.png";
import arrowLeftBlackOnLight from "../../assets/img/Home/carousel/arrow_left_black_on_light.png";
import arrowRightBlackOnLight from "../../assets/img/Home/carousel/arrow_right_black_on_light.png";
// --- Section 4 5 的圖片 import (請將圖片放置於建議路徑或自行修改) ---
import recommendedHeaderIcon from "../../assets/img/Home/recommended/Recommended_Header_Icon.png";
import upcomingHeaderIcon from "../../assets/img/Home/recommended/Upcoming_Header_Icon.png";
import arrowLeftRecommended from "../../assets/img/Home/recommended/arrow_left_white_on_dark.png";
import arrowRightRecommended from "../../assets/img/Home/recommended/arrow_right_white_on_dark.png";
import eventImg1 from "../../assets/img/Home/recommended/event-01.png";
import eventImg2 from "../../assets/img/Home/recommended/event-02.png";
import eventImg3 from "../../assets/img/Home/recommended/event-03.png";
import eventImg4 from "../../assets/img/Home/recommended/event-04.png";
import eventImg5 from "../../assets/img/Home/recommended/event-05.png";
import eventImg6 from "../../assets/img/Home/recommended/event-06.png";
import eventImg7 from "../../assets/img/Home/recommended/event-07.png";
import eventImg8 from "../../assets/img/Home/recommended/event-08.png";
import eventImg9 from "../../assets/img/Home/recommended/event-09.png";
import eventImg10 from "../../assets/img/Home/recommended/event-10.png";
import eventImg11 from "../../assets/img/Home/recommended/event-11.png";
function Home() {
  // --- 狀態管理和資料 (保持不變) ---
  const [locationData, setLocationData] = useState(["全部地區", "台北市", "台中市", "高雄市"]);
  const [categoryData, setCategoryData] = useState(["全部類型", "演唱會", "舞台劇", "音樂會"]);
  const [dateData, setDatesData] = useState(["全部時間", "今天", "一週內", "一個月內", "兩個月內"]);
  const [priceData, setPriceData] = useState([
    "全部價格",
    "免費",
    "TWD 1-1000",
    "TWD 1000-2000",
    "TWD 2000-3000",
    "TWD 3000 以上",
  ]);
  const [keyword, setKeyword] = useState("");
  const [locationSelect, setLocationSelect] = useState("");
  const [categorySelect, setCategorySelect] = useState("");
  const [dateSelect, setDateSelect] = useState("");
  const [priceSelect, setPriceSelect] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    console.log("搜尋條件:", {
      keyword,
      date: dateSelect || "全部時間",
      location: locationSelect || "全部地區",
      category: categorySelect || "全部類型",
      price: priceSelect || "全部價格",
    });
  };
  // --- 狀態管理和資料結束 ---
  // --- Section 1: 搜尋列 ---
  const renderHeroSection = () => {
    return (
      <section className="hero-section">
        {/* 主要容器 */}
        <div
          className="container d-flex flex-column justify-content-center align-items-center"
          style={{ minHeight: "70vh" }}
        >
          {/* 副標題 */}
          <p className="hero-subtitle">即刻玩賞台灣藝文</p>
          {/* --- 搜尋/篩選列 --- */}
          <form className="w-100" onSubmit={handleSearch}>
            {/* row 直接放在主 container 下 */}
            <div className="row g-0 mt-3 search-row">
              {/* 關鍵字輸入 */}
              <div className="col-md-3 col-12">
                <input
                  type="text"
                  className="form-control-customer form-control bg-dark text-white"
                  placeholder="搜尋活動關鍵字"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              {/* 參加時間 */}
              <div className="col-md-2 col-6">
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
              <div className="col-md-2 col-6">
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
              <div className="col-md-2 col-6">
                <select
                  className="form-control-customer form-select bg-dark text-white"
                  value={categorySelect}
                  onChange={(e) => setCategorySelect(e.target.value)}
                >
                  <option value="" disabled>
                    活動類型
                  </option>
                  {categoryData.map((item) => (
                    <option value={item} key={`cat-${item}`}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              {/* 價格 */}
              <div className="col-md-2 col-6">
                <select
                  className="form-control-customer form-select bg-dark text-white"
                  value={priceSelect}
                  onChange={(e) => setPriceSelect(e.target.value)}
                >
                  <option value="" disabled>
                    價格
                  </option>
                  {priceData.map((item) => (
                    <option value={item} key={`price-${item}`}>
                      {item}
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
                  <p className=" m-0 ms-1 d-inline d-md-none">搜尋</p>
                </button>
              </div>
            </div>
          </form>
          {/* --- 搜尋/篩選列 結束 --- */}
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
            {" "}
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
    // 輪播資料 (使用匯入的圖片，其他資訊用 placeholder)
    const slidesData = [
      {
        id: 1,
        img: carouselImg1,
        date: "2025-05-05",
        title: "經典再現《紅樓夢》沉浸式劇場",
        location: "台中市",
        category: "舞台劇",
      },
      {
        id: 2,
        img: carouselImg2,
        date: "2025-05-05",
        title: "台北愛樂《春之頌》交響音樂會",
        location: "高雄市",
        category: "音樂會",
      },
      {
        id: 3,
        img: carouselImg3,
        date: "2025-05-05",
        title: "當代戲劇《鏡中謎影》懸疑大戲",
        location: "台中市",
        category: "舞台劇",
      },
      {
        id: 4,
        img: carouselImg4,
        date: "2025-05-05",
        title: "Moonstruck《月光迷途》音樂旅程",
        location: "台北市",
        category: "演唱會",
      },
    ];

    return (
      <section className="carousel-section py-5">
        {/* Swiper 組件 */}
        <Swiper
          // --- 通用設定 ---
          modules={[Navigation, Pagination, EffectCoverflow, A11y]} // 啟用模組
          loop={true} // 循環播放
          grabCursor={true} // 顯示抓取鼠標
          pagination={{ clickable: true, el: ".swiper-custom-pagination" }} // 使用自訂分頁元素
          navigation={{
            // 使用自訂導航按鈕元素
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          a11y={{
            // 無障礙設定
            prevSlideMessage: "Previous slide",
            nextSlideMessage: "Next slide",
          }}
          // --- RWD 設定 (breakpoints) ---
          breakpoints={{
            // --- 行動裝置 (768px 以下) ---
            320: {
              effect: "slide", // 使用基本滑動效果
              slidesPerView: 1, // 一次顯示一張
              spaceBetween: 15, // Slide 間距
              centeredSlides: false, // 不需置中
            },
            // --- 桌面裝置 (768px 以上) ---
            768: {
              effect: "coverflow", // 使用 Coverflow 效果
              slidesPerView: "auto", // 自動計算顯示數量 (通常配合 CSS) 或設為 3
              centeredSlides: true, // Coverflow 需要置中
              spaceBetween: 30, // Slide 間距
              coverflowEffect: {
                rotate: 50, // 旋轉角度
                stretch: 0, // 拉伸
                depth: 100, // 深度
                modifier: 1, // 倍率
                slideShadows: true, // 顯示陰影
              },
            },
          }}
          className="home-main-carousel" // 自訂 class 以便添加樣式
        >
          {/* 渲染 Slides */}
          {slidesData.map((slide) => (
            <SwiperSlide key={slide.id} className="carousel-slide">
              {/* 背景圖片 */}
              <img src={slide.img} alt={slide.title} className="carousel-slide-img" />
              {/* 疊加內容 */}
              <div className="carousel-slide-content p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="slide-date small">{slide.date}</span>
                  <span className="slide-location small d-flex align-items-center">
                    {/* 可以加上地點圖示 */}
                    <i className="bi bi-geo-alt-fill me-1"></i> {/* 假設使用 Bootstrap Icons */}
                    {slide.location}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="slide-title mb-2 text-start">{slide.title}</h5>
                  <span className="slide-category">{slide.category}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* --- 自訂導航按鈕和分頁 --- */}
        <div className="swiper-controls container mt-3 d-flex justify-content-center align-items-center">
          <div className="swiper-button-prev-custom me-3">
            {/* 可以使用圖示字體或 SVG */}
            <img src={arrowLeftBlackOnLight} alt="上一張" />
          </div>
          <div className="swiper-custom-pagination"></div> {/* 分頁容器 */}
          <div className="swiper-button-next-custom ms-3">
            <img src={arrowRightBlackOnLight} alt="下一張" />
          </div>
        </div>
      </section>
    );
  };
  // --- Section 4: 熱門推薦 ---
  const renderRecommendedSection = () => {
    const recommendedEventsData = [
      {
        id: 1,
        img: eventImg1,
        date: "2025-05-05",
        location: "台北市",
        title: "Moonstruck《月光迷途》音樂旅程",
        category: "演唱會",
      },
      {
        id: 2,
        img: eventImg2,
        date: "2025-05-05",
        location: "台中市",
        title: "當代戲劇《鏡中謎影》懸疑大戲",
        category: "舞台劇",
      },
      {
        id: 3,
        img: eventImg3,
        date: "2025-05-05",
        location: "高雄市",
        title: "台北愛樂《春之頌》交響音樂會",
        category: "音樂會",
      },
      {
        id: 4,
        img: eventImg4,
        date: "2025-05-05",
        location: "台北市",
        title: "夜行少女《無盡之夜》全台巡演",
        category: "演唱會",
      },
      {
        id: 5,
        img: eventImg5,
        date: "2025-05-05",
        title: "Moonstruck《月光迷途》音樂旅程",
        location: "台北市",
        category: "演唱會",
      },
      {
        id: 6,
        img: eventImg6,
        date: "2025-05-05",
        location: "台中市",
        title: "黑色幽默劇《辦公室奇談》人生如戲",
        category: "舞台劇",
      },
      {
        id: 7,
        img: eventImg7,
        date: "2025-05-05",
        location: "高雄市",
        title: "國樂團《絲竹共鳴》東方韻味特場",
        category: "音樂會",
      },
      {
        id: 8,
        img: eventImg8,
        date: "2025-05-05",
        location: "台北市",
        title: "Retro Groove《復古風暴》現場演唱會",
        category: "演唱會",
      },
      {
        id: 9,
        img: eventImg9,
        date: "2025-05-05",
        title: "經典再現《紅樓夢》沉浸式劇場",
        location: "台中市",
        category: "舞台劇",
      },
      {
        id: 10,
        img: eventImg10,
        date: "2025-05-05",
        title: "鋼琴獨奏會《浪漫派之聲》蕭邦與李斯特",
        location: "高雄市",
        category: "音樂會",
      },
      {
        id: 11,
        img: eventImg11,
        date: "2025-05-05",
        title: "原創戲劇《時光書簡》跨世代親情故事",
        location: "台中市",
        category: "舞台劇",
      },
    ];

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
          {/* Swiper 組件 */}
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
            className="recommended-swiper" // 自訂 class 以便添加樣式
          >
            {/* 渲染 Slides */}
            {recommendedEventsData.map((event) => (
              <SwiperSlide key={event.id} className="recommended-slide">
                <div className="event-card mt-5">
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
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* Swiper 控制按鈕與分頁 */}
        <div className="swiper-controls-recommended mb-5 d-flex justify-content-center align-items-center">
          <div className="swiper-button-prev-recommended me-3">
            <img src={arrowLeftRecommended} alt="上一個" />
          </div>
          <div className="swiper-pagination-recommended"></div>
          <div className="swiper-button-next-recommended ms-3">
            <img src={arrowRightRecommended} alt="下一個" />
          </div>
        </div>
      </section>
    );
  };
  // --- Section 5: 即將登場 ---
  const renderUpcomingSection = () => {
    const upcomingEventsData = [
      {
        id: 1,
        img: eventImg1,
        date: "2025-05-05",
        location: "台北市",
        title: "Moonstruck《月光迷途》音樂旅程",
        category: "演唱會",
      },
      {
        id: 2,
        img: eventImg2,
        date: "2025-05-05",
        location: "台中市",
        title: "當代戲劇《鏡中謎影》懸疑大戲",
        category: "舞台劇",
      },
      {
        id: 3,
        img: eventImg3,
        date: "2025-05-05",
        location: "高雄市",
        title: "台北愛樂《春之頌》交響音樂會",
        category: "音樂會",
      },
      {
        id: 4,
        img: eventImg4,
        date: "2025-05-05",
        location: "台北市",
        title: "夜行少女《無盡之夜》全台巡演",
        category: "演唱會",
      },
      {
        id: 5,
        img: eventImg5,
        date: "2025-05-05",
        title: "Moonstruck《月光迷途》音樂旅程",
        location: "台北市",
        category: "演唱會",
      },
      {
        id: 6,
        img: eventImg6,
        date: "2025-05-05",
        location: "台中市",
        title: "黑色幽默劇《辦公室奇談》人生如戲",
        category: "舞台劇",
      },
      {
        id: 7,
        img: eventImg7,
        date: "2025-05-05",
        location: "高雄市",
        title: "國樂團《絲竹共鳴》東方韻味特場",
        category: "音樂會",
      },
      {
        id: 8,
        img: eventImg8,
        date: "2025-05-05",
        location: "台北市",
        title: "Retro Groove《復古風暴》現場演唱會",
        category: "演唱會",
      },
      {
        id: 9,
        img: eventImg9,
        date: "2025-05-05",
        title: "經典再現《紅樓夢》沉浸式劇場",
        location: "台中市",
        category: "舞台劇",
      },
      {
        id: 10,
        img: eventImg10,
        date: "2025-05-05",
        title: "鋼琴獨奏會《浪漫派之聲》蕭邦與李斯特",
        location: "高雄市",
        category: "音樂會",
      },
      {
        id: 11,
        img: eventImg11,
        date: "2025-05-05",
        title: "原創戲劇《時光書簡》跨世代親情故事",
        location: "台中市",
        category: "舞台劇",
      },
    ];

    return (
      <section className="upcoming-section py-0 position-relative">
        {/* 上方標題區 */}
        <div className="border my-5 p-3 border-secondary position-relative z-1">
          <div className="container d-flex align-items-center justify-content-between">
            <h2 className="section-title mb-0">即將登場</h2>
            <img src={upcomingHeaderIcon} alt="即將登場圖示" className="section-title-icon" />
          </div>
        </div>
        {/* Swiper 區塊 */}
        <div className="container position-relative z-1 py-4">
          {/* Swiper 組件 */}
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            loop={false}
            grabCursor={true}
            pagination={{ clickable: true, el: ".swiper-pagination-upcoming" }}
            navigation={{
              nextEl: ".swiper-button-next-upcoming",
              prevEl: ".swiper-button-prev-upcoming",
            }}
            a11y={{
              prevSlideMessage: "上一組推薦",
              nextSlideMessage: "下一組推薦",
            }}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 0, centeredSlides: true },
              768: { slidesPerView: 2, spaceBetween: 0, centeredSlides: false },
              992: { slidesPerView: 4, spaceBetween: 0, centeredSlides: false },
            }}
            className="upcoming-swiper" // 自訂 class 以便添加樣式
          >
            {/* 渲染 Slides */}
            {upcomingEventsData.map((event) => (
              <SwiperSlide key={event.id} className="upcoming-slide">
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
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* Swiper 控制按鈕與分頁 */}
        <div className="swiper-controls-upcoming mb-5 d-flex justify-content-center align-items-center">
          <div className="swiper-button-prev-upcoming me-3">
            <img src={arrowLeftRecommended} alt="上一個" />
          </div>
          <div className="swiper-pagination-upcoming"></div>
          <div className="swiper-button-next-upcoming ms-3">
            <img src={arrowRightRecommended} alt="下一個" />
          </div>
        </div>
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
