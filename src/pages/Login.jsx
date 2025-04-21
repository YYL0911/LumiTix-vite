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

  const [showErrorInfo, setShowErrorInfo] = useState(false);
  const [errMessage, setErrMessage] = useState(null);

  const navigate = useNavigate();

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
      if(!result.status){
        setErrMessage(result.message) 
        setShowErrorInfo(true)
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
  }, [watchForm]); // 將新變數傳入

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
          
          <button type=' button' className='btn btn-dark mt-3' onClick={() => navigate("/Register")}>
            註冊
          </button>

          <button type='submit' className='btn btn-outline-dark mt-3 mx-3'>
            登入
          </button>

        </form>
        
    </div>
  );
}

export default Login;
