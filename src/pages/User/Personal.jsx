import '../../assets/all.scss';
import { Modal } from "bootstrap";
import { useForm, useWatch } from "react-hook-form";
import { useState, useEffect, useRef  } from 'react';
import { useNavigate } from "react-router-dom";

// Context
import { useAuth } from '../../contexts/AuthContext';

// 元件
import Input from '../../conponents/Input';
import ButtonTipModal from "../../conponents/TipModal";
import Breadcrumb from '../../conponents/Breadcrumb';
import Loading from '../../conponents/Loading';

import { RiEdit2Fill } from "react-icons/ri";
import { FaRegCheckCircle } from "react-icons/fa";
import { HiOutlineLink } from "react-icons/hi2";
import { HiOutlineLinkSlash } from "react-icons/hi2";

// 麵包屑
const breadcrumb = [
  { name: '首頁', path: "/" },
  { name: '會員資訊', path: "/personal" },
];

function Personal() {
  const { setUserName, userToken, loading, userName  } = useAuth(); // [變更使用者名稱, token]
  const navigate = useNavigate(); // 跳轉頁面

  const [apiLoading, setApiLoading] = useState(false); // 使否開啟loading，傳送並等待API回傳時開啟
  const [isBindGoogle, setIsBindGoogle] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const [userBlock, setUserBlock] = useState(0);

  const isFirstRender = useRef(true); // 記錄是否是第一次渲染
  //取得使用者資料
  useEffect(() => {
    if (isFirstRender.current) {
      
      isFirstRender.current = false; // 更新為 false，代表已執行過
      // console.log("✅ useEffect 只執行一次");
      setApiLoading(true)
      fetch("https://n7-backend.onrender.com/api/v1/users/profile",{
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

            if(result.message == "使用者已被封鎖") setUserBlock(-1)
            else setUserBlock(1)
          }
          else{
            // ✅ 用 reset 動態設定預設值
            mainReset({
              userID: result.data.serialNo,
              email: result.data.email,
              name: result.data.name,
            });
            setIsBindGoogle(result.data.google_bind)
            setUserBlock(1)

            const googleInfo = localStorage.getItem("googleInfo");
            if(googleInfo){
              if(googleInfo == "bind") setUpdateNameResult("已取消綁定") 
              else setUpdateNameResult(googleInfo); 
              setModalTitle("綁定結果")
              successModalRef.current.open();
              localStorage.removeItem('googleInfo');
            }
          }
        })
        .catch(err => {
          navigate("/ErrorPage")
        });
    }
  }, []);


  const successModalRef = useRef(); // 修改名稱成功後彈窗
  const [updateNameResult, setUpdateNameResult] = useState(""); // 修改名稱api回傳訊息
  

  // 修改名稱-表單
  const {
    register: mainRegister,
    handleSubmit: mainHandleSubmit,
    control: mainControl,
    getValues: mainGetValues,
    reset: mainReset,
    formState: { errors: mainErrors, isValid: mainValid },
    
  } = useForm({ mode: 'onChange' });

  const onMainSubmit = (data) => {
    // console.log("主表單資料", data);
    setApiLoading(true)
    fetch("https://n7-backend.onrender.com/api/v1/users/profile",{
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`, // token 放這
      },
      body: JSON.stringify({
        name: data.name
      })
    }) 
    .then(res => res.json())
    .then(result => {
      setApiLoading(false)
      if(result.status){
        setUserName(data.name);
        setModalTitle("修改名稱結果")
        setUpdateNameResult(`成功修改名稱為${data.name}`);
        localStorage.setItem("name", data.name);
      }
      else setUpdateNameResult(result.message)
      successModalRef.current.open();
    })
    .catch(err => {
      navigate("/ErrorPage")
    });
  };

  const watchMain = useWatch({ control: mainControl }); // 監看表單狀態
  const [checkNameOk, setCheckNameOk] = useState(false); // 是否可以發送修改名稱api
  const [isNameTouched, setIsNameTouched] = useState(false); // 是否有輸入過密碼欄
  //表單變更
  useEffect(() => {

    if(Object.keys(mainErrors).length > 0 || userName == mainGetValues("name")
      || mainGetValues("name").length < 2 || mainGetValues("name").length > 10){
      setCheckNameOk(false)
    } 
    else setCheckNameOk(true)
  }, [watchMain, mainErrors]);

  // 即時更新錯誤狀態 || userName == mainGetValues("name")
  useEffect(() => {

    if(Object.keys(mainErrors).length > 0 
    || mainGetValues("name").length < 2 || mainGetValues("name").length > 10  // 
    ) {
      setCheckNameOk(false)
    }
    else setCheckNameOk(true)
  
  }, [mainValid]);



  const passwordModalRef = useRef(); // 修改密碼彈窗
  const passwordModal = useRef(); // 修改密碼彈窗操作(關閉/顯示)
  const [showErrorInfo, setShowErrorInfo] = useState(false); // 修改密碼api事後有誤
  const [errMessage, setErrMessage] = useState(null); // 修改密碼api錯誤訊息
  const [isPasswordTouched, setIsPasswordTouched] = useState(false); // 是否有輸入過密碼欄
  const [isConfirmTouched, setIsConfirmTouched] = useState(false); // 是否有輸入過確認密碼欄
  const [apiPasLoading, setApiPasLoading] = useState(false); // 使否開啟loading，傳送並等待API回傳時開啟

  // 密碼表單
  const {
    register: passwordRegister,
    handleSubmit: passwordHandleSubmit,
    control: passwordControl,
    watch: passwordWatch,
    reset: passwordReset,
    getValues: passwordGetValues,
    trigger: passwordTrigger,
    formState: { errors: passwordErrors, isValid: passwordValid, },
  } = useForm({ mode: 'onTouched' });

  const passwordValue = passwordWatch("password"); // 監看 password
  useEffect(() => {
    if (isPasswordTouched && isConfirmTouched){
      passwordTrigger("confirmPassword"); // 當 password 改變時，重新驗證
    }
  }, [passwordValue, passwordTrigger]);

  // 修改密碼api
  const onPasswordSubmit = (data) => {
    // console.log("密碼表單資料", data);
    setApiPasLoading(true)
    fetch("https://n7-backend.onrender.com/api/v1/users/password",{
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`, // token 放這
      },
      body: JSON.stringify({
        password: data.oldPassword,
        new_password: data.password,
        confirm_new_password: data.confirmPassword,
      })
    }) 
    .then(res => res.json())
    .then(result => {
      setApiPasLoading(false)
      if(result.status){
        passwordModal.current.hide(); // 提交成功關閉 Modal
        passwordReset();
        setShowErrorInfo(false)
        setIsConfirmTouched(false)
      }
      else{
        if(result.message == "尚未登入"){
          passwordModal.current.hide()
          navigate("/login")
          return
        }
        setErrMessage(result.message)
        setShowErrorInfo(true)
      }
      
    })
    .catch(err => {
      navigate("/ErrorPage")
    });
  };

  // 監看表單狀態
  const watchPassword = useWatch({ control: passwordControl });
  const [checkPasswordOk, setCheckPasswordOk] = useState(true);
  //表單變更
  useEffect(() => {
    //有錯誤
    if(Object.keys(passwordErrors).length > 0) setCheckPasswordOk(false)
    else if(showErrorInfo) setCheckPasswordOk(true)
  }, [watchPassword, passwordErrors]); // 將新變數傳入
  // 即時更新錯誤狀態
  useEffect(() => {
    if(Object.keys(passwordErrors).length > 0 || passwordGetValues("password") !== passwordGetValues("confirmPassword")) setCheckPasswordOk(false)
    else setCheckPasswordOk(true)
  }, [passwordValid]);

   // 初始化 Bootstrap Modal
  useEffect(() => {
    passwordModal.current = new Modal(passwordModalRef.current);
  }, []);


  const googleBind = () => {
    setApiPasLoading(true)
    if(isBindGoogle){
      
      fetch("https://n7-backend.onrender.com/api/v1/google/bind",{
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`, // token 放這
        },
      }) 
      .then(res => res.json())
      .then(result => {
        setApiPasLoading(false)
        setModalTitle("解除綁定結果")
        if(result.status){
          setIsBindGoogle(false)
          setUpdateNameResult(`${result.message}`);
        }
        else{
          if(result.message == "尚未登入"){
            navigate("/login")
            return
          }
          else{
            let context = result.message
            if(context == "僅有Google登入方式，請於更新密碼後再解除綁定"){
              context += "\n備註：修改密碼中舊密碼請隨意輸入8-32 字元，需包含英文數字大小寫"
            }
            
            setUpdateNameResult(context);
          }
        }

        successModalRef.current.open();
      })
      .catch(err => {
        navigate("/ErrorPage")
      });

    }
    else{
      const url = `${window.location.origin}${window.location.pathname}#/callback`;
      fetch(`https://n7-backend.onrender.com/api/v1/google/bind?redirectUri=${encodeURIComponent(url)}`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`, // token 放這
        },
      }) 
      .then(res => res.json())
      .then(result => {
        if(result.status){
          localStorage.setItem("googleInfo", "bind");
          window.location.href = result.data.redirectUrl;
        }
        else{
          if(result.message == "尚未登入"){
            navigate("/login")
            return
          }
          else{
            setApiPasLoading(false)
            setModalTitle("結果")
            setUpdateNameResult(`${result.message}`);
            successModalRef.current.open();
          }
        }
      })
      .catch(err => {
        navigate("/ErrorPage")
      });
    }
  }




  return (
    <div className='bg-body-tertiary flex-grow-1' >
      <div className='container py-3'>
        {/* 麵包屑 */}
        <Breadcrumb breadcrumbs={breadcrumb} />

        {userBlock == -1 && (<h3 className='mb-3 text-secondary text-center '>帳號已被封鎖</h3>)}
        <div className={`card shadow p-3 mb-5 bg-white rounded mx-auto ${userBlock == 1 ? "d-block": "d-none"}`} style={{maxWidth: 500+"px"}}>
            <h3 className='mb-3 text-secondary mx-auto'>會員資訊</h3>
            <form onSubmit={mainHandleSubmit(onMainSubmit)}>
              <div className="mb-3 w-100 " >
                <Input
                  id="userID"
                  type="text"
                  errors={mainErrors}
                  labelText="會員編號"
                  register={mainRegister}
                  disabled={true}
                / >
              </div>
              <div className="mb-3 w-100" >
                <Input
                  id="email"
                  type="email"
                  labelText="Email(帳號)"
                  errors={mainErrors}
                  register={mainRegister}
                  disabled={true}
                />
              </div>
              <div className="mb-3 w-100" >
                <Input
                  id="name"
                  type='text'
                    errors={mainErrors}
                    labelText='使用者名稱'
                    register={mainRegister}
                    rules={{
                      //必填
                      required: '使用者名稱為必填', 
                      minLength: {value: 2, message: '使用者名稱不少於 2'},
                      maxLength: {value: 10,message: '使用者名稱長度不超過 10',},
                      onChange: () => setIsNameTouched(true)
                    }}
                />
              </div>

              <div className="d-flex justify-content-between mb-3 w-100" >
                <div className="col-12 mx-auto">
                    <button
                      type="submit"
                      className={`btn btn-dark w-100  d-flex align-items-center justify-content-center ${(checkNameOk&&isNameTouched) ? "" : "disabled"}`}
                    >
                      儲存修改
                      <FaRegCheckCircle size={20} color="#fff" className={`ms-2`}/>
                      
                    </button>
                </div>
              </div>
            </form>

            <ButtonTipModal ref={successModalRef} title={modalTitle} info={updateNameResult} />

            <hr className="flex-grow-1" />
            <button
              type="button"
              className="btn btn-outline-dark mt-3 w-100  d-flex align-items-center justify-content-center"
              onClick={() => passwordModal.current.show()} 
            >
              修改密碼 <RiEdit2Fill size={22} color="#C41508" className={`ms-2`}/>
            </button>

            {isBindGoogle ? 
              <button
                type="button"
                className="btn btn-outline-dark mt-3 w-100  d-flex align-items-center justify-content-center bind-btn"
                onClick={() => googleBind()} 
              >
                解除Google綁定 <HiOutlineLinkSlash size={22}  className={`ms-2 icon`}/>
              </button>
            :
              <button
                type="button"
                className="btn btn-outline-dark mt-3 w-100  d-flex align-items-center justify-content-center bind-btn"
                onClick={() => googleBind()} 
              >
                綁定Google帳號 <HiOutlineLink size={22}  className={`ms-2 icon`}/>
              </button>
            }
      

            {/* 密碼 Modal */}
            <div className="modal fade inert" tabIndex="-1" ref={passwordModalRef}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <form onSubmit={passwordHandleSubmit(onPasswordSubmit)}>
                    <div className="modal-header">
                      <h5 className="modal-title">修改密碼</h5>
                    </div>
                    <div className="modal-body">
                    <div className='mb-3 w-100' style={{maxWidth: 600+"px"}}>
                        <Input
                          id="oldPassword"
                          type="password"
                          labelText="舊密碼"
                          errors={passwordErrors}
                          register={passwordRegister}
                          rules={{
                            required: '舊密碼為必填',
                            minLength: { value: 8, message: '不少於 8 碼' },
                            maxLength: { value: 32, message: '不超過 32 碼' },
                          }}
                          placeholderTet="舊密碼"
                        />
                      </div>

                      <div className='mb-3 w-100' style={{maxWidth: 600+"px"}}>
                        <Input
                          id="password"
                          type="password"
                          labelText="新密碼"
                          errors={passwordErrors}
                          register={passwordRegister}
                          rules={{
                            required: '新密碼為必填',
                            minLength: { value: 8, message: '不少於 8 碼' },
                            maxLength: { value: 32, message: '不超過 32 碼' },
                            onChange: () => setIsPasswordTouched(true)
                          }}
                          placeholderTet="新密碼"
                        />
                      </div>
                      <div className='mb-3 w-100' style={{maxWidth: 600+"px"}}>
                        <Input
                          id="confirmPassword"
                          type="password"
                          labelText="確認密碼"
                          errors={passwordErrors}
                          register={passwordRegister}
                          rules={{
                            required: '請再次輸入密碼',
                            validate: (value) => {
                              if (!isPasswordTouched && !isConfirmTouched) return true;
                              return value === passwordGetValues("password") || "兩次密碼不一致";
                            },
                            onChange: () => setIsConfirmTouched(true)
                          }}
                          placeholderTet="再次輸入密碼"
                        />
                      </div>
                      {showErrorInfo && <div className='my-2 text-danger' style={{maxWidth: 600+"px"}}>{errMessage}</div>}

                    </div>



                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-outline-dark"
                        onClick={() => {
                          passwordReset()
                          setShowErrorInfo(false)
                          setIsConfirmTouched(false)
                          passwordModal.current.hide()
                        }}
                      >
                        取消
                      </button>
                      <button type="submit" className={`btn btn-dark ${checkPasswordOk ? "" : "disabled"}`} >
                        確認修改
                      </button>
                    </div>
                  </form>
                  {(apiPasLoading) && (<Loading></Loading>)}
                </div>
              </div>
            </div>
        </div>

        {(!loading && apiLoading && !apiPasLoading) && (<Loading></Loading>)}
      </div>

    </div>
  );
}

export default Personal;
