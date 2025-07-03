import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation, } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
import axios from 'axios'

// 元件
import Breadcrumb from "../conponents/Breadcrumb";
import InfoSection from "../conponents/InfoSection";

import { IoHeartCircleOutline } from "react-icons/io5";
import { IoHeartCircleSharp } from "react-icons/io5";

function EventInfo() {
  const location = useLocation();
  // location.state?.collect
  const { collect } = location.state || false;  // 要加 || {} 防止錯誤
  const { id } = useParams();
  const navigate = useNavigate();
  dayjs.extend(utc);
  dayjs.extend(duration);

  const { userToken, userRole, logout } = useAuth();

  const isFirstRender = useRef(true);
  const [apiLoading, setApiLoading] = useState(false);
  const [event, setEvent] = useState({})
  const [saleStatus, setSaleStatus] = useState("countdown");
  const [timeLeft, setTimeLeft] = useState(null);
  const timeRef = useRef(null);

  const [isCollect, setIsCollect] = useState(collect);

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
    const LoginAlert = (message) => {
      Swal.fire({
        icon: 'warning',
        title: message,
        confirmButtonText: `確認`,
      }).then(() => {
        navigate('/login')
      });
    }

    if (!userToken) {
      LoginAlert('請先登入，再購買票券')
    } else if (userRole != 'General') {
      LoginAlert('請先登入一般會員，再購買票券')
    } else {
      navigate(`/eventInfo/${id}/payments`, {
        state: {
          sectionId: section.id,
          sectionName: section.section,
          price: section.price_default
        }
      });
    }
  };

  // 將活動加入收藏
  const onToggleCollect = async () => {
    const sweetAlert = (message, page) => {
      Swal.fire({
        icon: 'warning',
        title: message,
        confirmButtonText: `確認`,
      }).then(() => {
        navigate(page)
      });
    }

    if (!userToken) {
      sweetAlert('請先登入，再收藏活動', '/login')
      return
    } else if (userRole != 'General') {
      sweetAlert('請先登入一般會員，再收藏活動', '/login')
    }

    try {
      const res = await axios.patch(
        `https://n7-backend.onrender.com/api/v1/users/toggle-collect/${id}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${userToken}`,
          },
        }
      );

      if (res.data.status) {
        setIsCollect(!isCollect)
      }
      else {
        sweetAlert(res.message, '/allEvents')
      }
    } catch (err) {
      if (err.response.data.message == "使用者已被封鎖") {
        Swal.fire({
          title: "帳號已被封鎖",
          text: "您的帳號因違反使用條款已被停權，如有疑問請聯繫客服。",
          icon: "error",
          confirmButtonText: "了解",
        }).then(() => {
          logout()
          setIsCollect(false)
        });
      }
      else sweetAlert("發生異常，請稍後在試", '/allEvents')
    }
  };

  useEffect(() => {
  }, [isCollect]);


  // 取得單一活動資訊
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`https://n7-backend.onrender.com/api/v1/events/${id}`);
        setApiLoading(false);

        if (res.data.status) {
          setEvent(res.data.data || []);
          // console.log('API 回傳資料:', res.data.data);
        }
      } catch (err) {
        setApiLoading(false);
        // console.error('取得活動失敗', err);
        Swal.fire({
          icon: 'error',
          title: '錯誤',
          text: '無法取得活動資訊，請稍後再試',
        }).then(() => {
          navigate('/allEvents');
        })
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

  // 格式化剩餘時間
  function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds };
  }

  // 倒數計時器邏輯
  useEffect(() => {
    if (!event.sale_start_at || !event.sale_end_at) return;

    if (timeRef.current) clearInterval(timeRef.current);

    timeRef.current = setInterval(() => {
      const now = dayjs();
      const start = dayjs(event.sale_start_at.replace('Z', ''));
      const end = dayjs(event.sale_end_at.replace('Z', ''));

      let status = "ended";
      let time = null;

      if (now.isBefore(start)) {
        status = "countdown";
        time = formatTime(start.diff(now));
      } else if (now.isBefore(end)) {
        status = "active";
        time = formatTime(end.diff(now));
      }

      setSaleStatus(status);
      setTimeLeft(time);
    }, 1000);

    return () => clearInterval(timeRef.current);
  }, [event]);

  // 倒數計時元件
  const CountdownTimer = () => (
    <div className="px-3 py-2 bg-Primary-50">
      <div className="d-flex justify-content-between fw-bold">
        <p className="text-Primary-900">
          {saleStatus === "countdown" ? "距離開賣" :
            saleStatus === "active" ? "距離截止" : "已結束"}
        </p>
        {(saleStatus === "countdown" || saleStatus === "active") && timeLeft && (
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

  // 轉換UTC時間(演出日期)
  function showTimeStartToEnd(start, end) {
    if (dayjs.utc(start).format("YYYY-MM-DD") === dayjs.utc(end).format("YYYY-MM-DD")) {
      const startTime = dayjs.utc(start).format("YYYY-MM-DD HH:mm");
      const endTime = dayjs.utc(end).format("HH:mm");
      return `${startTime} ～ ${endTime}`;
    } else {
      const startTime = dayjs.utc(start).format("YYYY-MM-DD HH:mm");
      const endTime = dayjs.utc(end).format("YYYY-MM-DD HH:mm");
      return `${startTime} ～ ${endTime}`;
    }
  }

  // 轉換UTC時間(售票時間)
  function showSaleTime(startSale, endSale) {
    const startTime = dayjs.utc(startSale).format("YYYY-MM-DD HH:mm");
    const endTime = dayjs.utc(endSale).format("YYYY-MM-DD HH:mm");
    return `${startTime} ～ ${endTime}`;
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
            <p className="text-Neutral-700 me-3" style={{ minWidth: "70px" }}>演出日期</p>
            <p className="fw-bold">{showTimeStartToEnd(event.start_at, event.end_at)}</p>
          </div>
          <div className="d-flex justify-content-between">
            <p className="text-Neutral-700 me-3" style={{ minWidth: "70px" }}>演出人員</p>
            <p className="fw-bold">{event.performance_group}</p>
          </div>
          <div className="d-flex justify-content-between">
            <p className="text-Neutral-700 me-3" style={{ minWidth: "70px" }}>演出地點</p>
            <div>
              <p className="fw-bold text-end">{event.location}</p>
              <p className="fw-bold text-end">{event.address}</p>
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <p className="text-Neutral-700 me-3" style={{ minWidth: "70px" }}>演出類型</p>
            <p className="fw-bold">{event.Type?.name}</p>
          </div>
          <div className="d-flex justify-content-between">
            <p className="text-Neutral-700 me-3" style={{ minWidth: "70px" }}>售票時間</p>
            <div className="d-flex flex-column flex-sm-row gap-1">
              <p className="fw-bold">{showSaleTime(event.sale_start_at, event.sale_end_at)}</p>
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
      <div className="border border-2 border-Neutral-700 px-4 py-3 bg-Neutral-700 d-flex justify-content-between">
        <h5 className="text-white fw-bold">{title}</h5>
        {isCollect && (
          <IoHeartCircleOutline size={30} color="red" className={`me-2`} type="button"
            onClick={(e) => { onToggleCollect() }} />
        )}
        {!isCollect && (
          <IoHeartCircleSharp size={30} color="#fff" className={`me-2`} type="button"
            onClick={(e) => { onToggleCollect() }} />
        )}


      </div>
      <div className="border border-2 border-top-0 border-Neutral-700 px-lg-4 px-3 py-lg-6 py-4">
        <div className="d-flex flex-column flex-lg-row gap-6">

          <div className="col m-auto">
            <img className="w-100" src={event.section_image_url} alt="票券區域圖" />
          </div>

          <div className="col w-100">
            <CountdownTimer />

            {event.Section?.map((section, index) => {
              const isSoldOut = section.remainingSeats === 0;
              let buttonText = "";
              if (saleStatus === "countdown") buttonText = "尚未開賣";
              else if (saleStatus === "active" && isSoldOut) buttonText = "票券售完";
              else if (saleStatus === "active") buttonText = "購買票券";
              else buttonText = "售票結束";

              return (
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
                      className={`border-0 py-2 px-3 ${saleStatus === "active" && !isSoldOut ? "btn-sale" : "btn-unsale"
                        }`}
                      disabled={saleStatus !== "active" || isSoldOut}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate(section);
                      }}
                    >
                      <p className="fw-bold">{buttonText}</p>
                    </button>
                  </div>
                  <div className="border-2 border-top border-Neutral-700"></div>
                </div>
              );
            })}

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
            <img className="coverImg img-contain p-lg-0 p-1" src={event.cover_image_url} alt={event.title || "活動封面"} style={{ maxWidth: '1212px', maxHeight: '660px' }} />
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