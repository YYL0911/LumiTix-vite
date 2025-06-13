import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode"; // 掃描套件
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// Context
import { useAuth } from '../../contexts/AuthContext';

// 元件
import Loading from "../../conponents/Loading";

// 判斷是否是手機
function isMobileDevice() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

const showSwal = (icon, title, info) => {
    withReactContent(Swal).fire({
      icon: icon,
      title: title,
      text: info,
    })
}

function TicketScaner() {
  const { userToken, loading  } = useAuth();
  const navigate = useNavigate(); 
  const [apiLoading, setApiLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [eventID, setEventID] = useState("");
  const eventIDRef = useRef("");

  useEffect(() => {
    setIsMobile(isMobileDevice())
  }, [isMobile]);


  const isFirstRender = useRef(true); // 記錄是否是第一次渲染
  const [options, setOptions] = useState([]);
  
  
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // 更新為 false，代表已執行過
    
      // console.log(" useEffect 只執行一次");
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
            if(result.data.length > 0){
              setEventID(result.data[0].id)
              eventIDRef.current = result.data[0].id; // 同步更新 ref
            } 
            const eventIDStorage = localStorage.getItem("scanEventID");
            if(eventIDStorage){
              setEventID(eventIDStorage)
              eventIDRef.current = eventIDStorage; // 同步更新 ref
              if (!result.data.some((item) => item.id == eventIDStorage) ){
                setEventID("")
                eventIDRef.current = ""; // 同步更新 ref
              } 
              else{
                setEventID(eventIDStorage)
                eventIDRef.current = eventIDStorage; 
              } 
            } 
          }
        })
        .catch(err => {
          navigate("/ErrorPage")
        });
    }
  }, []);



  const changeSelectActive = (e) =>{
    localStorage.setItem("scanEventID", e.target.value);
    setEventID(e.target.value)
    eventIDRef.current = e.target.value; 
  }


  const handleScan = (data) => {
    let ticket403 = false
    //由DATA抓到QRCORD資訊
    fetch(`https://n7-backend.onrender.com/api/v1/organizer/events/${eventIDRef.current}/verify/?token=${data}`, {
      method: "PATCH",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`, // token 放這
    }}) 
    .then((res) =>{
      if(res.status == 403 ) ticket403 = true
      return res.json()
    } )
    .then((res) => {
      if (res.status) navigate('/ticketScanerResult', { state: { result: res} });
      else if(res.message == "尚未登入" )navigate("/login");
      else if(ticket403 ) navigate('/');
      else navigate('/ticketScanerResult', { state: { result: res} });
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
      const currentEventID = eventIDRef.current;
      
      if(currentEventID == ""){
        showSwal("error", "驗票失敗", "未選擇要驗票活動")
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
         {/* {eventID}  */}
          選擇活動
        </label>

        <select
          id="inputGroupSelect01"
          value={eventID}
          onChange={(e) => changeSelectActive(e)}
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

    </div>
  );
}

export default TicketScaner;
