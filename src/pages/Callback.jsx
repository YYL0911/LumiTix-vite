
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef} from 'react';

// Context
import { useAuth } from '../contexts/AuthContext';

// 元件
import Loading from "../conponents/Loading";



function Callback() {
  const { login } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  
  const isFirstRender = useRef(true); // 記錄是否是第一次渲染
  //取得使用者資料
  useEffect(() => {
    if (isFirstRender.current) {
      
      isFirstRender.current = false; // 更新為 false，代表已執行過
      // console.log("✅ useEffect 只執行一次");

      const paramError = searchParams.get("error") || "";
      const googleInfo = localStorage.getItem("googleInfo");
        if(googleInfo == "bind"){
          if (paramError != ""){
            switch (paramError) {
              case "repeated_binded":
                localStorage.setItem("googleInfo", "帳號已綁定過相同Google帳號");
                break;
              case "binded_other_user":
                localStorage.setItem("googleInfo", "此Google帳號已被其他使用者綁定");
                break;
              case "already_binded":
                localStorage.setItem("googleInfo", "帳號已綁定過其他Google帳號");
                break;
            
              default:
                localStorage.setItem("googleInfo", "未預期之錯誤");
                break;
            }
          } 
          else localStorage.setItem("googleInfo", "綁定成功"); 

          navigate("/personal")

        }
        else if(googleInfo == "login"){
          if (paramError != ""){
            switch (paramError) {
              case "email_used":
                localStorage.setItem("googleInfo", "Email已被使用，請使用帳密方式登入後，綁定Google帳號");
                break;
              case "signup_failed":
                localStorage.setItem("googleInfo", "註冊失敗");
                break;
            
              default:
                localStorage.setItem("googleInfo", "未預期之錯誤");
                break;
            }

            navigate("/login")
          } 
          else {

            const paramToken = searchParams.get("token");
            const paramName = searchParams.get("name");
            login("General", paramName, paramToken)
            localStorage.removeItem('googleInfo');
            navigate("/")
          }

        }
        else{
          navigate("/")

        }
      
    }
  }, []);




  return (
    <>
      
      <Loading></Loading>
    </>
  );
}

export default Callback;
