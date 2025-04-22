import '../../assets/all.scss'
import { useAuth } from '../../contexts/AuthContext';

import Input from '../../conponents/Input';
import ButtonTipModal from "../../conponents/TipModal";
import Breadcrumb from '../../conponents/Breadcrumb';

// import React from 'react';
import { useForm, useWatch } from "react-hook-form";
import { useState, useEffect, useRef } from 'react';

const breadcrumb = [
  { name: '首頁', path: "/" },
  { name: '註冊', path: "/Register" },
];

function Register() {
  const { login } = useAuth();
  const [showErrorInfo, setShowErrorInfo] = useState(false);
  const [loading, setloading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);

  const modalRef = useRef();
  const {
    register : formRegister,
    handleSubmit,
    control, // 了解當前運作的哪一個register
    formState: { errors }, //
  } = useForm({
    mode: 'onTouched',
  });

  const onSubmit = (data) => {
    // console.log(errors);
    // console.log(data);
    setloading(true)
    // 註冊api
    fetch("https://n7-backend.onrender.com/api/v1/users/signup",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.username,
        email: data.email,
        password: data.password,
        confirm_password: data.confirmPassword,
      })
    }) 
    .then(res => res.json())
    .then(result => {
      if(!result.status){
        setloading(false)
        setErrMessage(result.message) 
        setShowErrorInfo(true)
      }
      else{
        callLoginApi(data)
      }
    })
    .catch(err => {
      console.log(err);
    });

  };

  const callLoginApi = (data) => {
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
      }
      else{
        login("General Member", result.data.user.name, result.data.token)
        modalRef.current.open();
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
  }, [watchForm]); // 將新變數傳入

  return (
    <div>
        <Breadcrumb breadcrumbs = {breadcrumb}></Breadcrumb>
        <form action='' onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-3 w-100' style={{maxWidth: 600+"px"}}>
            <Input
              id='username'
              type='text'
              errors={errors}
              labelText='使用者名稱'
              register={formRegister}
              rules={{
                //必填
                required: '使用者名稱為必填', 
                minLength: {
                  value: 2,
                  message: '使用者名稱不少於 2'
                },
                maxLength: {
                  value: 10,
                  message: '使用者名稱長度不超過 10',
                },
              }}
              placeholderTet = "使用者名稱"
            ></Input>
          </div>
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

            <Input
              id='confirmPassword'
              labelText=''
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
              placeholderTet = "再次輸入密碼"
            ></Input>
          </div>
          
          {showErrorInfo && <div className='mt-4 text-danger'>{errMessage}</div>}

          <button type='submit' className='btn btn-dark mt-3'>
            註冊
          </button>

          <ButtonTipModal  ref={modalRef}
            title = "提示標題" 
            info = "註冊成功，即將跳轉到首頁" 
            navigatePath = "/" 
            changePage = {true}>
          </ButtonTipModal>
          
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

export default Register;
