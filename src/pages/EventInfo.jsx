import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../conponents/Breadcrumb";

const testData = {
  "status": "success",             // 結果 boolean
  "message": "活動資料載入成功",    // 回傳訊息  
  "event_id": "123e4567-e89b-12d3-a456-426614174000",  // UUID
  "title": "MOSAIC BAND《色彩爆發》世界巡演",   // varchar
  "location": "台北小巨蛋",         // varchar
  "address": "台北市松山區南京東路四段2號",  // varchar
  "start_at": "2025-08-16T19:30:00Z",  // timestamp
  "end_at": "2025-08-16T22:00:00Z",    // timestamp
  "sale_start_at": "2025-05-01T10:00:00Z",  // timestamp
  "sale_end_at": "2025-07-01T23:59:59Z",    // timestamp
  "perform_group": "MOSAIC BAND",     // varchar
  "discription": "MOSAIC BAND 帶來的全新世界巡演，將會在台北小巨蛋進行表演，別錯過這場音樂盛宴！", // text
  "cast": "MOSAIC BAND, 特邀嘉賓: DJ KAI", // varchar(320)
  "body": "這是一場充滿能量和音樂的演唱會，MOSAIC BAND 會演出他們的經典歌曲，並且帶來全新專輯的首度表演。", // text
  "cover_Image": "https://fakeimg.pl/1212x560/?text=test",  // url
  "section_Image": "https://fakeimg.pl/606x618/?text=test", // url
  "type": true,                    // boolean
  "event_status": "",          // varchar
  "created_at": "2025-03-01T10:00:00Z",   // timestamp
  "updated_at": "2025-05-01T12:00:00Z",   // timestamp
  "check_at": "2025-08-01T09:00:00Z",     // timestamp
  "user_id": "d59e4567-e89b-12d3-a456-426614174123"  // UUID
}

const ticketAreas = [
  { name: "A區", price: 2500 },
  { name: "B區", price: 2000 },
  { name: "B1區", price: 2000 },
  { name: "B2區", price: 2000 },
  { name: "C區", price: 1500 },
  { name: "D區", price: 1000 },
];

const sections = [
  { id: 'section1', label: '活動詳情' },
  { id: 'section2', label: '注意事項' },
  { id: 'section3', label: '購票須知' },
  { id: 'section4', label: '票券區域' }
];

function getEventStatus(saleStart, saleEnd) {
  const now = new Date().getTime();
  const start = new Date(saleStart).getTime();
  const end = new Date(saleEnd).getTime();

  if (now < start) return "尚未開賣";
  if (now >= start && now <= end) return "立即購票";
  return "販售結束";
}

testData.event_status = getEventStatus(testData.sale_start_at, testData.sale_end_at);

function EventInfo() {
  // 麵包屑
  const breadcrumb = [
    { name: '首頁', path: "/" },
    { name: '活動列表', path: "/allEvents" },
    { name: `${testData.title}`, path: "/eventInfo/:id" }
  ];

  // 滾動到指定區塊的函數
  const [activeTab, setActiveTab] = useState('section1');

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    const navbar = document.querySelector('.sticky-navbar');
    if (section) {
      const navbarHeight = navbar?.offsetHeight || 0;
      const offsetTop = section.offsetTop - navbarHeight;

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });

      setActiveTab(id);
    }
  };

  // 顯示&隱藏navbar
  const [showStickyNavbar, setShowStickyNavbar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const isMobile = window.innerWidth < 768;
      const threshold = isMobile ? 560 : 950;
      setShowStickyNavbar(scrollTop > threshold);

      // 自動判斷 active section
      const sectionOffsets = sections.map(({ id }) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          return { id, top: rect.top };
        }
        return { id, top: Infinity };
      });

      const visibleSection = sectionOffsets
        .filter(section => section.top <= 150)
        .sort((a, b) => b.top - a.top)[0];

      if (visibleSection && visibleSection.id !== activeTab) {
        setActiveTab(visibleSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeTab])

  // 顯示時間倒數及按鈕狀態變化
  const [saleStatus, setSaleStatus] = useState("countdown");

  const CountdownTimer = ({ startTime, endTime, onStatusChange }) => {
    const [status, setStatus] = useState("countdown");
    const [timeLeft, setTimeLeft] = useState(null);

    // 格式化剩餘時間
    function formatTime(ms) {
      return {
        days: Math.floor(ms / (1000 * 60 * 60 * 24)),
        hours: Math.floor((ms / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((ms / (1000 * 60)) % 60),
        seconds: Math.floor((ms / 1000) % 60),
      };
    }

    function calculateStatusAndTime() {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();

      if (now < start) {
        return { newStatus: "countdown", time: formatTime(start - now) };
      } else if (now >= start && now <= end) {
        return { newStatus: "active", time: formatTime(end - now) };
      } else {
        return { newStatus: "ended", time: null };
      }
    }

    useEffect(() => {
      const timer = setInterval(() => {
        const { newStatus, time } = calculateStatusAndTime();

        // 狀態有變才更新
        if (newStatus !== status) {
          setStatus(newStatus);
          onStatusChange && onStatusChange(newStatus);
        }

        setTimeLeft(time);
      }, 1000);

      return () => clearInterval(timer);
    }, [startTime, endTime, status, onStatusChange]);

    const renderStatusText = () => {
      if (status === "countdown") return "距離開賣";
      if (status === "active") return "距離截止";
      return "已結束";
    };

    return (
      <div className="px-3 py-2 bg-Primary-50">
        <div className="d-flex justify-content-between fw-bold">
          <p className="text-Primary-900">{renderStatusText()}</p>
          {(status === "countdown" || status === "active") && timeLeft && (
            <div className="d-flex gap-2 text-Primary-700 fw-bold">
              <p>{String(timeLeft.days).padStart(2, "0")}</p>
              <p>:</p>
              <p>{String(timeLeft.hours).padStart(2, "0")}</p>
              <p>:</p>
              <p>{String(timeLeft.minutes).padStart(2, "0")}</p>
              <p>:</p>
              <p>{String(timeLeft.seconds).padStart(2, "0")}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="container container-sm">
        <div className="m-xy-1">

          <Breadcrumb breadcrumbs={breadcrumb} />

          {/* 活動封面 */}
          <div className="border border-2 border-black p-lg-7 p-2 mb-4">
            <img className="p-lg-0 p-1 w-100" src={testData.cover_Image} alt="活動封面" />
          </div>

          {/* 活動標題 */}
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-4 mb-lg-8 mb-7">
            <h1 className="fw-bold">{testData.title}</h1>
            <button className={`border-0 py-3 px-4 saleStatusBtn ${testData.event_status === "立即購票" ? "btn-sale" : "btn-unsale"}`}
              disabled={testData.event_status !== "立即購票"}
              onClick={() => scrollToSection('section4')}>
              <p className="fw-bold m-0 text-center">{testData.event_status}</p>
            </button>
          </div>

        </div>
      </div>

      {/* navbar sticky */}
      <ul className="nav eventInfo-nav border-bottom border-2 border-black p-2 sticky-navbar" style={{ display: showStickyNavbar ? "block" : "none" }}>
        <div className="container">
          <div className="m-x-1">
            <div className="d-flex gap-2">
              {sections.map(({ id, label }) => (
                <li key={id} className={`nav-item ${activeTab === id ? "border-bottom border-3 border-danger" : ""}`}>
                  <button className="nav-link text-black" onClick={() => scrollToSection(id)}>
                    {label}
                  </button>
                </li>
              ))}
            </div>
          </div>
        </div>
      </ul>

      {/* navbar unSticky */}
      <div className="container">
        <div className="m-x-1">
          <ul className={`nav eventInfo-nav border border-2 border-black p-2 mb-4 mb-lg-7 ${showStickyNavbar === false ? "" : "hide-visibility"}`}>
            <div className="d-flex gap-2">
              {sections.map(({ id, label }) => (
                <li key={id} className={`nav-item ${activeTab === id ? "border-bottom border-3 border-danger" : ""}`}>
                  <button className="nav-link text-black" onClick={() => scrollToSection(id)}>
                    {label}
                  </button>
                </li>
              ))}
            </div>
          </ul>
        </div>
      </div>

      <div className="container">
        <div className="m-xy-2">

          {/* 活動詳情 */}
          <div className="mb-lg-7 mb-4 sectionTop" id="section1">
            <div className="border border-2 border-Neutral-700 px-4 py-3 bg-Neutral-700">
              <h5 className="text-white fw-bold">活動詳情</h5>
            </div>
            <div className="border border-2 border-top-0 border-Neutral-700 px-lg-4 px-3 py-lg-6 py-4">
              <div className="d-flex flex-column gap-6">
                <div className="d-flex justify-content-between">
                  <p className="text-Neutral-700">演出日期</p>
                  <p className="fw-bold">{new Date(testData.start_at).toLocaleString()}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="text-Neutral-700">演出人員</p>
                  <p className="fw-bold">{testData.perform_group}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="text-Neutral-700">演出地點</p>
                  <div>
                    <p className="fw-bold text-end">{testData.location}</p>
                    <p className="fw-bold text-end">{testData.address}</p>
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="text-Neutral-700">演出類型</p>
                  <p className="fw-bold">演唱會</p>
                </div>
              </div>
              <div className="border-2 border-top border-Neutral-700 my-6"></div>
              <div>
                <p>{testData.body}</p>
              </div>
            </div>
          </div>

          {/* 注意事項 */}
          <div className="mb-lg-7 mb-4 sectionTop" id="section2">
            <div className="border border-2 border-Neutral-700 px-4 py-3 bg-Neutral-700">
              <h5 className="text-white fw-bold">注意事項</h5>
            </div>
            <div className="border border-2 border-top-0 border-Neutral-700 px-lg-4 px-3 py-lg-6 py-4">
              <ul className="d-flex flex-column gap-lg-6 gap-4 mb-0">
                <li>禁止攜帶外食與飲料入場。</li>
                <li>禁止攜帶專業攝影器材、錄音錄影設備。</li>
                <li>場館內禁止吸菸，請於指定區域內使用電子煙。</li>
                <li>若有任何身體不適，請立即向現場工作人員尋求協助。</li>
                <li>請遵守工作人員指示，保持演出秩序，尊重其他觀眾。</li>
              </ul>
            </div>
          </div>

          {/* 購票須知 */}
          <div className="mb-lg-7 mb-4 sectionTop" id="section3">
            <div className="border border-2 border-Neutral-700 px-4 py-3 bg-Neutral-700">
              <h5 className="text-white fw-bold">購票須知</h5>
            </div>
            <div className="border border-2 border-top-0 border-Neutral-700 px-lg-4 px-3 py-lg-6 py-4">
              <ul className="d-flex flex-column gap-lg-6 gap-4 mb-0">
                <li>本演出門票僅限LumiTix販售，請勿透過非官方渠道購買，以免遭遇詐騙或無法入場。</li>
                <li>購票需註冊LumiTix帳號，請提前完成註冊，以便順利購票與查看票券。</li>
                <li>門票一經售出，恕不退換，請確認您的行程與訂單內容後再行購買。</li>
                <li>提醒：為確保您的權益，請務必妥善保管電子票券，不要將票券資訊洩漏給他人，以免遭到盜用。</li>
                <li>電子票券資訊：本場次採用電子票券，購票成功後，系統將寄送電子票券連結至您註冊的電子郵件信箱，或可直接登入 LumiTix 帳戶查看您的票券資訊。進場時，請準備好可連接網路的智慧型手機或平板，開啟電子票券並向現場工作人員出示入場畫面，驗證後即可入場。</li>
              </ul>
            </div>
          </div>

          {/* 票券區域 */}
          <div className="mb-lg-7 mb-4 sectionTop" id="section4">
            <div className="border border-2 border-Neutral-700 px-4 py-3 bg-Neutral-700">
              <h5 className="text-white fw-bold">票券區域</h5>
            </div>
            <div className="border border-2 border-top-0 border-Neutral-700 px-lg-4 px-3 py-lg-6 py-4">
              <div className="d-flex flex-column flex-lg-row gap-6">

                <div className="col m-auto">
                  <img className="w-100" src={testData.section_Image} alt="票券區域圖" />
                </div>

                <div className="col w-100">
                  <CountdownTimer
                    startTime={testData.sale_start_at}
                    endTime={testData.sale_end_at}
                    onStatusChange={(status) => setSaleStatus(status)}
                  />

                  {ticketAreas.map((section, index) => (
                    <div key={index}>
                      <div className="d-flex align-items-center justify-content-between my-lg-4 my-3">
                        <div className="d-flex gap-3">
                          <p className="text-Neutral-700" style={{ minWidth: '60px' }}>{section.name}</p>
                          <p className="fw-bold">NT$ {section.price.toLocaleString()}</p>
                        </div>
                        <button className={`border-0 py-2 px-3 ${saleStatus === "active" ? "btn-sale" : "btn-unsale"}`}
                          disabled={saleStatus !== "active"}>
                          <p className="fw-bold">
                            {saleStatus === "countdown" && "尚未開賣"}
                            {saleStatus === "active" && "購買票券"}
                            {saleStatus === "ended" && "票券售完"}
                          </p>
                        </button>
                      </div>
                      <div className="border-2 border-top border-Neutral-700"></div>
                    </div>
                  ))}

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default EventInfo;