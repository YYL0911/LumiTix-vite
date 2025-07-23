import '../assets/all.scss';
import { useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";

// Context
import { useAuth } from '../contexts/AuthContext';
import {signin} from '../api/user'

// 元件
import Input from '../conponents/Input';
import Breadcrumb from '../conponents/Breadcrumb';
import Loading from '../conponents/Loading';

import { FcGoogle } from "react-icons/fc";

import loginBG from "../assets/img/login.png"

//麵包屑
const breadcrumb = [
  { name: '首頁', path: "/" },
  { name: '登入', path: "/Login" },
];

function Login() {
  const { login} = useAuth();
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const [checkOk, setCheckOk] = useState(true);
  const [showErrorInfo, setShowErrorInfo] = useState(false);
  const [errMessage, setErrMessage] = useState(null);

  const {
    register : formRegister,
    handleSubmit,
    control, // 了解當前運作的哪一個register
    formState: { errors, isValid}, //
  } = useForm({
    mode: "onTouched",         // 初次觸發驗證的時機
  });

  const onSubmit = (data) => {
    // console.log(errors);
    // console.log(data);
    setloading(true)
    // 登入api

    signin({
      email: data.email,
      password: data.password
    })
    .then(result => {
      if(result.data.user.role == "General"){
        login("General", result.data.user.name, result.data.token)
        navigate("/");
      } 
      else if(result.data.user.role == "Organizer"){
        login("Organizer", result.data.user.name, result.data.token)
        navigate("/events");
        
      } 
      else if(result.data.user.role == "Admin"){
        login("Admin", result.data.user.name, result.data.token)
        navigate("/eventsList");
      } 
    })
    .catch(err => {
      if(err.type == "OTHER"){
        // 顯示錯誤資訊
        setErrMessage(result.message) 
        setShowErrorInfo(true)
        setCheckOk(false)
      }
      else navigate("/ErrorPage")
    })
    .finally (() =>{
      setloading(false); // 關閉loading
    })

  };

  //確認當前表單狀態
  const watchForm = useWatch({
    control,
  });


  //表單變更
  useEffect(() => {
    //有錯誤
    if(Object.keys(errors).length > 0) setCheckOk(false)
    else if(showErrorInfo) setCheckOk(true)
  }, [watchForm, errors]); // 將新變數傳入

  // 即時更新錯誤狀態
  useEffect(() => {
    if(Object.keys(errors).length > 0) setCheckOk(false)
    else setCheckOk(true)
  }, [isValid]); 


  const googleLogin = () => {
      setloading(true)
      const url = `${window.location.origin}${window.location.pathname}#/callback`;
      localStorage.setItem("googleInfo", "login");
      window.location.href = `https://n7-backend.onrender.com/api/v1/google/signin-or-signup?redirectUri=${encodeURIComponent(url)}`;
  }

  useEffect(() => {
    const googleInfo = localStorage.getItem("googleInfo");
    if(googleInfo){
      if(googleInfo == "login") setErrMessage("取消登入") 
      else setErrMessage(googleInfo) 
      setShowErrorInfo(true)
      localStorage.removeItem('googleInfo');
    }
  }, []); 

  return (
    <div className='container py-3 '>
        <Breadcrumb breadcrumbs = {breadcrumb}></Breadcrumb>

        <div className="w-100 d-flex">

          <div className=" w-100 w-md-50" style={{maxWidth: 500+"px"}}>
            {/* card shadow p-3 mb-5 bg-white rounded mx-auto */}
            <div className="w-100" >
              <h3 className='mb-3 text-secondary mx-auto'>會員登入</h3>
              <form action='' onSubmit={handleSubmit(onSubmit)}>
                <div className='mb-3 w-100' >
                  <Input
                    id='email'
                    labelText='Email'
                    type='email'
                    errors={errors}
                    register={formRegister}
                    rules={{
                      required: 'Email 為必填',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Email 格式不正確',
                      },
                    }}
                    placeholderTet = "Email"
                  ></Input>
                </div>
                <div className='mb-3 w-100' >
                  <Input
                    id='password'
                    labelText='密碼'
                    type='password'
                    errors={errors}
                    register={formRegister}
                    rules={{
                      required: '密碼為必填',
                      minLength: {
                        value: 8,
                        message: '密碼不少於 8 碼'
                      },
                      maxLength: {
                        value: 32,
                        message: '密碼不超過 32 碼'
                      }
                    }}
                    placeholderTet = "密碼"
                  ></Input>
                </div>

                {/* 錯誤訊息 */}
                {showErrorInfo && <div className='mt-4 text-danger'>{errMessage}</div>}
                
                <button type="submit" className={`w-100 btn btn-dark  px-4 my-3 py-2 ${checkOk ? "" : "disabled"}`} >登入</button>
                
                <div className="d-flex align-items-center mb-3">
                  <hr className="flex-grow-1" />
                  <div className="px-3 text-nowrap">或用以下方式登入</div>
                  <hr className="flex-grow-1" />
                </div>

                <button type="button" className={`btn btn-outline-dark py-2 w-100 mb-3`} 
                onClick={() => googleLogin()}>
                  <FcGoogle size={24} className={`me-2`}/>
                  Google 
                </button>
                  
                
                {/* 註冊文字 */}
                <div className="d-flex align-items-center my-2">
                  <span className="me-2 text-body-secondary">還沒有帳號嗎？</span>
                  <Link to='/register' className="my-auto text-black border-bottom border-black">立即註冊</Link>
                </div>
              </form>


            </div>
          </div>

          {/* 右側圖片區 */} 
          <div className="d-none d-md-flex w-50 d-flex justify-content-end align-items-end ms-5">
            <img
              src={loginBG}
              alt="Login Visual"
              className="img-fluid"
              style={{
                objectFit: 'contain',
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            />
          </div>


        </div>


        {loading && (<Loading></Loading>)}
    </div>
  );
}

export default Login;
