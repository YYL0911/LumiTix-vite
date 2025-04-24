import '../assets/all.scss'
import { useAuth } from '../contexts/AuthContext';

import Input from '../conponents/Input';
import Breadcrumb from '../conponents/Breadcrumb';

import { useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const breadcrumb = [
  { name: '首頁', path: "/" },
  { name: '登入', path: "/Login" },
];

function Login() {
  const { login } = useAuth();
  const [loading, setloading] = useState(false);
  const [checkOk, setCheckOk] = useState(true);

  const [showErrorInfo, setShowErrorInfo] = useState(false);
  const [errMessage, setErrMessage] = useState(null);

  const navigate = useNavigate();

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
    fetch("https://n7-backend.onrender.com/api/v1/users/signin",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password
      })
    }) 
    .then(res => res.json())
    .then(result => {
      setloading(false)
      if(!result.status){
        setErrMessage(result.message) 
        setShowErrorInfo(true)
        setCheckOk(false)
      }
      else{
        if(result.data.user.role == "General Member"){
          login("General Member", result.data.user.name, result.data.token)
          navigate("/");
        } 
        else if(result.data.user.role == "Customer"){
          login("organizer", result.data.user.name, result.data.token)
          navigate("/Events");
        } 
        else if(result.data.user.role == "Admin"){
          login("admin", result.data.user.name, result.data.token)
          navigate("/");
        } 
      }
    })
    .catch(err => {
      console.log(err);
    });

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

  return (
    <div>
        <Breadcrumb breadcrumbs = {breadcrumb}></Breadcrumb>
        <form action='' onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-3 w-100' style={{maxWidth: 600+"px"}}>
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
          <div className='mb-3 w-100' style={{maxWidth: 600+"px"}}>
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

          {showErrorInfo && <div className='mt-4 text-danger'>{errMessage}</div>}
          

          
          <button type="submit" className={`btn btn-dark me-2 px-3 my-3 ${checkOk ? "" : "disabled"}`} >登入</button>
          

          <div className="d-flex align-items-center">
            <span className="me-2">還沒有帳號嗎？</span>
            <a  className="my-auto text-black" onClick={() => navigate("/Register")}>立即註冊</a>
          </div>


        </form>

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

export default Login;
