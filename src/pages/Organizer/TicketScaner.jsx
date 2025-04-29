import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode"; // 掃描套件
import { QRCodeCanvas } from 'qrcode.react'; // 生成QR CORD套件

// 元件
import Loading from "../../conponents/Loading";


// 判斷是否是手機
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


  const handleScan = (data) => {
    // console.log(data)
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
    //       setStatus("驗證成功！歡迎入場");
    //     } else {
    //       setStatus("驗證失敗：" + res.message);
    //     }
    //   })
    //   .catch(() => setStatus("網路錯誤"));
  };

 // 需要等畫面渲染完成，才能抓到ID
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
      scanner.clear();
      handleScan(result)
      setloading(true)
    }
    function error(err){
      
    }
  }, []);

  

  return (
    <div className='container'>
      <h2>掃描 QR Code</h2>
      <div id = "reader"></div>

      {/* <QRCodeCanvas
          value='成功'// 生成二维码的内容
          size={200} // 二维码的大小
      /> */}


      {loading && (<Loading></Loading>)}

    </div>
  );
}

export default TicketScaner;
