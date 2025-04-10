import '../assets/all.scss'

import Input from '../conponents/Input';
import ButtonTipModal from "../conponents/TipModal";
import Breadcrumb from '../conponents/Breadcrumb';

// import React from 'react';
import { useForm, useWatch } from "react-hook-form";
import { useEffect, useRef } from 'react';

function Register() {
  const breadcrumb = [
    { name: '首頁', path: "/" },
    { name: '註冊', path: "/Register" },
  ];

  

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
    console.log(errors);
    console.log(data);

    modalRef.current.open();
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
                  value: 6,
                  message: '密碼不少於 6 碼'
                },
                maxLength: {
                  value: 12,
                  message: '密碼不超過 12 碼'
                }
              }}
              placeholderTet = "密碼"
            ></Input>

            <Input
              id='repassword'
              labelText=''
              type='password'
              errors={errors}
              register={formRegister}
              rules={{
                required: '密碼為必填',
                minLength: {
                  value: 6,
                  message: '密碼不少於 6 碼'
                },
                maxLength: {
                  value: 12,
                  message: '密碼不超過 12 碼'
                }
              }}
              placeholderTet = "再次輸入密碼"
            ></Input>
          </div>
          

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
        
    </div>
  );
}

export default Register;
