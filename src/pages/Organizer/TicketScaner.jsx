import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";
import { QRCodeCanvas } from 'qrcode.react';


function isMobileDevice() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}



function TicketScaner() {
  const navigate = useNavigate();
 

  const [loading, setloading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(isMobileDevice())
  }, [isMobile]);

  const [scanResult, setScanResult] = useState(null);


  const handleScan = (data) => {
    // console.log(data)
    // navigate('/ticketCheckResult', { state: { name: '小明', age: 20 } });
    navigate('/ticketScanerResult', { state: { result: data} });

    // 你可以改成呼叫後端驗證會員入場
    // fetch(`https://your-api.com/checkin`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ qrData: data }),
    // })
    //   .then((res) => res.json())
    //   .then((res) => {
    //     if (res.status) {
    //       setStatus("✅ 驗證成功！歡迎入場");
    //     } else {
    //       setStatus("❌ 驗證失敗：" + res.message);
    //     }
    //   })
    //   .catch(() => setStatus("❌ 網路錯誤"));
  };


  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox:{
        width:250,
        height: 250,
      },
      fps: 10,
    })
    scanner.render(success, error)

    function success(result){
      setScanResult(result)
    //   console.log(result)
      scanner.clear();
      
      handleScan(result)
    //   console.log(1234)
      setloading(true)
  
    }
    function error(err){
      
    }
  }, []);

  

  return (
    <div>
      <h2>掃描 QR Code</h2>
      <div id = "reader"></div>

      {/* <ButtonTipModal  ref={modalRef}
            title = "掃描訊息" 
            info = "找不到QR CORD" 
            navigatePath = "/" 
            changePage = {true}>
      </ButtonTipModal> */}


      {/* <QRCodeCanvas
          value='成功'// 生成二维码的内容
          size={200} // 二维码的大小
       
      /> */}


      {loading && (
          <div className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}>
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

    </div>


  );
}

export default TicketScaner;
