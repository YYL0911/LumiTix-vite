import '../../assets/all.scss';
import { useForm, useWatch } from "react-hook-form";
import { useState, useEffect, useRef } from 'react';

// Context
import { useAuth } from '../../contexts/AuthContext';

// 使用元件
import Input from '../../conponents/Input';
import ButtonTipModal from "../../conponents/TipModal";
import Breadcrumb from '../../conponents/Breadcrumb';
import Loading from '../../conponents/Loading';



// 麵包屑資訊
const breadcrumb = [
  { name: '首頁', path: "/" },
  { name: '註冊', path: "/register" },
];

function Register() {
  const { login } = useAuth(); // 註冊成功後直接登入
  const [loading, setloading] = useState(false); // 使否開啟loading，傳送並等待API回傳時開啟
  const [checkOk, setCheckOk] = useState(true); // 傳送按鈕是否開啟 => 前端鑑驗輸入是否都符合規則
  const [showErrorInfo, setShowErrorInfo] = useState(false); // API 回傳是否有錯誤
  const [errMessage, setErrMessage] = useState(null); // API 回傳的錯誤訊息
  const modalRef = useRef(); // 彈窗ref

  // 註冊表單
  const {
    register : formRegister,
    handleSubmit,
    control, // 了解當前運作的哪一個register
    getValues,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onTouched',
  });


  // 要連動密碼與確認密碼
  const [isPasswordTouched, setIsPasswordTouched] = useState(false); // 是否有輸入過密碼欄
  const [isConfirmTouched, setIsConfirmTouched] = useState(false); // 是否有輸入過確認密碼欄
  const passwordValue = watch("password"); // 監看 password 

  useEffect(() => {
    // 在密碼與確認密碼都有輸入過的情況下，若有更動其中一項，確認密碼必須重新檢驗
    if (isPasswordTouched && isConfirmTouched){
      trigger("confirmPassword"); // 當 password 改變時，重新驗證 confirmPassword
    }
  }, [passwordValue, trigger]);

  const onSubmit = (data) => {
    // console.log(errors);
    // console.log(data);
    setloading(true); // 開啟loading開啟loading
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
      // 註冊失敗
      if(!result.status){
        setloading(false); // 關閉loading
        // 顯示錯誤資訊
        setErrMessage(result.message);
        setShowErrorInfo(true);
        setCheckOk(false); // 禁止再次發送 => 需有變過表單內任一資訊
      }
      else{
        // 註冊成功 => 直接呼叫登入
        callLoginApi(data);
      }
    })
    .catch(err => {
      console.log(err);
    });

  };

  // 呼叫登入
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
      setloading(false);
      if(!result.status){
        setErrMessage(result.message) ;
        setShowErrorInfo(true);
      }
      else{
        login("General", result.data.user.name, result.data.token)
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
    //有錯誤
    if(Object.keys(errors).length > 0) setCheckOk(false)
    else if(showErrorInfo) setCheckOk(true)
  }, [watchForm, errors]); // 將新變數傳入
  // 即時更新錯誤狀態
  useEffect(() => {
    if(Object.keys(errors).length > 0 || getValues("password") !== getValues("confirmPassword")) setCheckOk(false)
    else setCheckOk(true)
  }, [isValid]);


  return (
    <div className='container'>
        {/* 麵包屑 */}
        <Breadcrumb breadcrumbs = {breadcrumb}></Breadcrumb>

        {/* 註冊表單
        - 使用者名稱
        - 信箱
        - 密碼
        - 確認密碼 */}
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
                  value: 50,
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
                },
                onChange: () => setIsPasswordTouched(true)
              }}
              placeholderTet = "密碼"
            ></Input>
          </div>
          <div className='mb-3 w-100' style={{maxWidth: 600+"px"}}>
            <Input
              id='confirmPassword'
              labelText='確認密碼'
              type='password'
              errors={errors}
              register={formRegister}
              rules={{
                required: '確認密碼為必填',
                validate: (value) => {
                  if (!isPasswordTouched && !isConfirmTouched) return true;
                  return value === getValues("password") || "兩次密碼不一致";
                },
                onChange: () => setIsConfirmTouched(true)
              }}
              placeholderTet = "再次輸入密碼"
            ></Input>
          </div>
          
          {/* 錯誤訊息 */}
          {showErrorInfo && <div className='mt-4 text-danger'>{errMessage}</div>}

          <button type='submit' className={`btn btn-dark mt-3 ${checkOk ? "" : "disabled"}`} >
            註冊
          </button>

          {/* 彈窗 */}
          <ButtonTipModal  ref={modalRef}
            title = "註冊結果" 
            info = "註冊成功，即將跳轉到首頁" 
            navigatePath = "/" 
            changePage = {true}>
          </ButtonTipModal>
        </form>

        {loading && (<Loading></Loading>)}
    </div>
  );
}

export default Register;
