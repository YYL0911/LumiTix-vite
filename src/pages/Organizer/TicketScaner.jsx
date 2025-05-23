import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode"; // 掃描套件

// Context
import { useAuth } from '../../contexts/AuthContext';

// 元件
import Loading from "../../conponents/Loading";
import ButtonTipModal from "../../conponents/TipModal";


// 判斷是否是手機
function isMobileDevice() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

function TicketScaner() {
  const { userToken, loading  } = useAuth();
  const navigate = useNavigate(); 
  const [apiLoading, setApiLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const modalRef = useRef(); // 彈窗ref


  const [eventsInfo, setEventsInfo] = useState(null);
  const [eventID, setEventID] = useState("");

  useEffect(() => {
    setIsMobile(isMobileDevice())
  }, [isMobile]);


  const isFirstRender = useRef(true); // 記錄是否是第一次渲染
  const [options, setOptions] = useState([]);
  
  
  useEffect(() => {
    if (isFirstRender.current) {
      
      isFirstRender.current = false; // 更新為 false，代表已執行過
      // console.log("✅ useEffect 只執行一次");
      setApiLoading(true)
      fetch("https://n7-backend.onrender.com/api/v1/organizer/events/by-status?status=holding",{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`, // token 放這
        }}) 
        .then(res => res.json())
        .then(result => {
          setApiLoading(false)

          if(!result.status){
            if(result.message == "尚未登入") navigate("/login");
            else navigate("/");
          }
          else{
            setOptions(result.data)

            const eventID = localStorage.getItem("scanEventID");
            if(eventID){
              if (!result.data.some((item) => item.id == eventID) ) setEventID("")
              else setEventID(eventID)
            } 
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, []);



  useEffect(() => {
    localStorage.setItem("scanEventID", eventID);
  }, [eventID]);



  const handleScan = (data) => {
    // const fake = {
    //   "status": true,
    //   "message": "驗票成功",
    //   "data": {
    //     "ticket_no": "T250510RZrFHpgeYd", //因為是針對票券掃描，線稿圖好像應改為票券編號
    //     "event":{
    //        "tilte": "台北愛樂《春之頌》交響音樂會",
    //        "location": "臺北國家音樂廳",
    //        "start_at": "2025-05-05 18:00",
    //        "end_at": "2025-05-05 20:00"
    //     },
    //     "user": {
    //       "name": "王小明",
    //       "email": "wang123@gmail.com"
    //     }
    //   }
    // }

    // // console.log(data)
    // navigate('/ticketScanerResult', { state: { result: fake} });

    let ticket400 = false

    //由DATA抓到QRCORD資訊
    // 你可以改成呼叫後端驗證會員入場
    fetch(`https://n7-backend.onrender.com/api/v1/organizer/events/${eventID}/verify/?token=${data}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      "Authorization": `Bearer ${userToken}`, // token 放這
    })
    .then((res) =>{
      if(res.status == 400) ticket400 = true
      return res.json()
    } )
    .then((res) => {
      if (res.status) navigate('/ticketScanerResult', { state: { result: res.data} });
      else if(ticket400) navigate('/ticketScanerResult', { state: { result: res} });
      else if(res.message == "尚未登入" )navigate("/login");
      else navigate('/');
    })
    .catch(() => {});
  };

 // 需要等畫面渲染完成，才能抓到ID
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox:{
        width:300,
        height: 300,
      },
      fps: 10,
    })
    scanner.render(success, error)

    function success(result){
      

      if(eventID == ""){
        modalRef.current.open();
      }
      else{
        scanner.clear();
        handleScan(result)
        setApiLoading(true)
      } 

    }
    function error(err){
      
    }
  }, []);


  return (
    <div className='container py-3'>
      <div className="input-group mb-5 mt-2">
        <label className="form-label m-auto me-2 fs-4" htmlFor="inputGroupSelect01">
          活動名稱
        </label>

        <select
          id="inputGroupSelect01"
          value={eventID}
          onChange={(e) => setEventID(e.target.value)}
          className="form-select rounded-0 form-select-lg bg-secondary text-white holdingEventsList"
          style={{ whiteSpace: 'normal' }}
        >

          {options.length === 0 ? (
            <option disabled value="">未有舉辦中活動</option>
          ) : (
            options.map(opt => (
              <option key={opt.id} value={opt.id}  >{opt.title}</option>
            ))
          )}
        </select>
      </div>

      
      <div id = "reader"></div>


      { !loading && apiLoading && (<Loading></Loading>)}

      <ButtonTipModal  ref={modalRef}
          title = "驗票提示" 
          info = "未選擇驗票活動" 
      >
      </ButtonTipModal>

    </div>
  );
}

export default TicketScaner;
