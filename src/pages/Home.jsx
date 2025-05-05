import React, { useState } from "react";
// --- Section 1 的 import ---
import searchIcon from "../assets/img/Search.png";
// --- Section 2 的圖片 import ---
import boltIcon from "../assets/img/Home/features/bolt.png";
import encryptedIcon from "../assets/img/Home/features/encrypted.png";
import groupsIcon from "../assets/img/Home/features/groups.png";
import taiwanMap from "../assets/img/Home/features/Vector.png";

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

  return (
    <>
      {renderHeroSection()}
      {renderWhyChooseUsSection()}
      {/* ... 其他 Section ... */}
    </>
  );
}

export default Home;
