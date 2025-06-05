import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios'

// 元件
import Breadcrumb from "../conponents/Breadcrumb";
import InfoSection from "../conponents/InfoSection";

function EventInfo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isFirstRender = useRef(true); // 記錄是否是第一次渲染
  const [apiLoading, setApiLoading] = useState(false); // 使否開啟loading，傳送並等待API回傳時開啟
  const [event, setEvent] = useState({})

  // 麵包屑
  const breadcrumb = [
    { name: '首頁', path: "/" },
    { name: '活動列表', path: "/allEvents" },
    { name: `${event.title}`, path: "/eventInfo/:id" }
  ];

  // section
  const sections = [
    { id: 'section1', label: '活動詳情' },
    { id: 'section2', label: '注意事項' },
    { id: 'section3', label: '購票須知' },
    { id: 'section4', label: '票券區域' }
  ];

  // 前往購票
  const handleNavigate = (section) => {
    navigate(`/eventInfo/${id}/payments`, {
      state: {
        sectionId: section.id,
        sectionName: section.section,
        price: section.price_default
      }
    });
    // console.log(section)
  };

  // 取得單一活動資訊
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`https://n7-backend.onrender.com/api/v1/events/${id}`);
        setApiLoading(false);

        if (res.data.status) {
          setEvent(res.data.data || []);
          console.log('API 回傳資料:', res.data.data);
        }
      } catch (err) {
        setApiLoading(false);
        // console.error('取得活動失敗', err);
        navigate('/ErrorPage');
      }
    };

    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchEvent();
    }
  }, []);

  // 滾動到指定區塊的函數
  const [activeTab, setActiveTab] = useState('section1');
  const [showStickyNavbar, setShowStickyNavbar] = useState(false);
  const unStickyNavbarRef = useRef(null);

  // 滾動到指定區塊
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    const navbar = document.querySelector('.sticky-navbar');
    if (section) {
      const navbarHeight = navbar?.offsetHeight || 0;
      const offsetTop = section.offsetTop - navbarHeight;
      window.scrollTo({ top: offsetTop, behavior: "smooth", block: "start" });
    }
  };

  // 顯示&隱藏navbar
  useEffect(() => {
    const handleScroll = () => {
      // 判斷 unSticky navbar 是否被 header 擋住
      if (unStickyNavbarRef.current) {
        const rect = unStickyNavbarRef.current.getBoundingClientRect();
        const isHiddenByHeader = rect.top <= 0;
        setShowStickyNavbar(isHiddenByHeader);
      }

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
  }, [activeTab, sections]);

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

        setStatus(newStatus);
        onStatusChange && onStatusChange(newStatus);
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
              <p>{String(timeLeft.days).padStart(2, "0")} 天</p>
              <p>{String(timeLeft.hours).padStart(2, "0")} 時</p>
              <p>{String(timeLeft.minutes).padStart(2, "0")} 分</p>
              <p>{String(timeLeft.seconds).padStart(2, "0")} 秒</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 轉換UTC時間(演出日期)
  function showTimeStartToEnd(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const year = startDate.getUTCFullYear();
    const month = String(startDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(startDate.getUTCDate()).padStart(2, '0');
    const startHour = String(startDate.getUTCHours()).padStart(2, '0');
    const startMinute = String(startDate.getUTCMinutes()).padStart(2, '0');
    const endHour = String(endDate.getUTCHours()).padStart(2, '0');
    const endMinute = String(endDate.getUTCMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${startHour}:${startMinute} ～ ${endHour}:${endMinute}`;
  }

  // 轉換UTC時間(售票時間)
  function showTime(utcString) {
    const date = new Date(utcString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hour = String(date.getUTCHours()).padStart(2, '0');
    const minute = String(date.getUTCMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }

  // 活動詳情區域
  const EventDetail = ({ id, title, event }) => (
    <div className="mb-lg-7 mb-4 sectionTop" id={id}>
      <div className="border border-2 border-Neutral-700 px-4 py-3 bg-Neutral-700">
        <h5 className="text-white fw-bold">{title}</h5>
      </div>
      <div className="border border-2 border-top-0 border-Neutral-700 px-lg-4 px-3 py-lg-6 py-4">
        <div className="d-flex flex-column gap-6">
          <div className="d-flex justify-content-between">
            <p className="text-Neutral-700">演出日期</p>
            <p className="fw-bold">{showTimeStartToEnd(event.start_at, event.end_at)}</p>
          </div>
          <div className="d-flex justify-content-between">
            <p className="text-Neutral-700">演出人員</p>
            <p className="fw-bold">{event.performance_group}</p>
          </div>
          <div className="d-flex justify-content-between">
            <p className="text-Neutral-700">演出地點</p>
            <div>
              <p className="fw-bold text-end">{event.location}</p>
              <p className="fw-bold text-end">{event.address}</p>
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <p className="text-Neutral-700">演出類型</p>
            <p className="fw-bold">{event.Type?.name}</p>
          </div>
          <div className="d-flex justify-content-between">
            <p className="text-Neutral-700">售票時間</p>
            <div className="d-flex flex-column flex-sm-row gap-1">
              <p className="fw-bold">{showTime(event.sale_start_at)}</p>
              <p className="fw-bold text-center">～</p>
              <p className="fw-bold">{showTime(event.sale_end_at)}</p>
            </div>
          </div>
        </div>
        <div className="border-2 border-top border-Neutral-700 my-6"></div>
        <div>
          <p>{event.description}</p>
        </div>
      </div>
    </div>
  );

  // 注意事項
  const noticInfo = [
    "禁止攜帶外食與飲料入場。",
    "禁止攜帶專業攝影器材、錄音錄影設備。",
    "場館內禁止吸菸，請於指定區域內使用電子煙。",
    "若有任何身體不適，請立即向現場工作人員尋求協助。",
    "請遵守工作人員指示，保持演出秩序，尊重其他觀眾。",
  ];

  // 購票須知
  const buyTicketInfo = [
    "本演出門票僅限LumiTix販售，請勿透過非官方渠道購買，以免遭遇詐騙或無法入場。",
    "購票需註冊LumiTix帳號，請提前完成註冊，以便順利購票與查看票券。",
    "門票一經售出，恕不退換，請確認您的行程與訂單內容後再行購買。",
    "提醒：為確保您的權益，請務必妥善保管電子票券，不要將票券資訊洩漏給他人，以免遭到盜用。",
    "電子票券資訊：本場次採用電子票券，購票成功後，系統將寄送電子票券連結至您註冊的電子郵件信箱，或可直接登入 LumiTix 帳戶查看您的票券資訊。進場時，請準備好可連接網路的智慧型手機或平板，開啟電子票券並向現場工作人員出示入場畫面，驗證後即可入場。",
  ];

  // 票券區域
  const TicketSection = ({ id, title, event, saleStatus, setSaleStatus, handleNavigate }) => (
    <div className="mb-lg-7 mb-4 sectionTop" id={id}>
      <div className="border border-2 border-Neutral-700 px-4 py-3 bg-Neutral-700">
        <h5 className="text-white fw-bold">{title}</h5>
      </div>
      <div className="border border-2 border-top-0 border-Neutral-700 px-lg-4 px-3 py-lg-6 py-4">
        <div className="d-flex flex-column flex-lg-row gap-6">

          <div className="col m-auto">
            <img className="w-100" src={event.section_image_url} alt="票券區域圖" />
          </div>

          <div className="col w-100">
            <CountdownTimer
              startTime={event.sale_start_at}
              endTime={event.sale_end_at}
              onStatusChange={setSaleStatus}
            />

            {event.Section?.map((section, index) => (
              <div key={index}>
                <div className="d-flex align-items-center justify-content-between my-lg-4 my-3">
                  <div className="d-flex gap-3">
                    <p className="text-Neutral-700" style={{ minWidth: '60px' }}>
                      {section.section} 區
                    </p>
                    <p className="fw-bold">
                      NT$ {section.price_default.toLocaleString()}
                    </p>
                  </div>
                  <button
                    className={`border-0 py-2 px-3 ${saleStatus === "active" ? "btn-sale" : "btn-unsale"}`}
                    disabled={saleStatus !== "active"}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigate(section);
                    }}
                  >
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
  );

  return (
    <>
      <div className="container container-sm">
        <div className="m-xy-1">

          <Breadcrumb breadcrumbs={breadcrumb} />

          {/* 活動封面 */}
          <div className="border border-2 border-black p-lg-7 p-2 mb-4">
            <img className="p-lg-0 p-1 w-100" src={event.cover_image_url} alt="活動封面" />
          </div>

          {/* 活動標題 */}
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-4 mb-lg-8 mb-7">
            <h1 className="fw-bold">{event.title}</h1>
            <button
              className={`border-0 py-3 px-4 saleStatusBtn ${saleStatus === "active" ? "btn-sale" : "btn-unsale"}`}
              disabled={saleStatus !== "active"}
              onClick={() => scrollToSection('section4')}
            >
              <p className="fw-bold m-0 text-center">
                {saleStatus === "countdown" ? "尚未開賣" : saleStatus === "active" ? "立即購票" : "販售結束"}
              </p>
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
          <ul ref={unStickyNavbarRef} className={`nav eventInfo-nav border border-2 border-black p-2 mb-4 mb-lg-7 ${showStickyNavbar === false ? "" : "hide-visibility"}`}>
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
          <EventDetail id="section1" title="活動詳情" event={event} />

          {/* 注意事項 */}
          <InfoSection id="section2" title="注意事項" items={noticInfo} />

          {/* 購票須知 */}
          <InfoSection id="section3" title="購票須知" items={buyTicketInfo} />

          {/* 票券區域 */}
          <TicketSection id="section4" title="票券區域" event={event} saleStatus={saleStatus} setSaleStatus={setSaleStatus} handleNavigate={handleNavigate} />

        </div>
      </div>
    </>
  );
}

export default EventInfo;