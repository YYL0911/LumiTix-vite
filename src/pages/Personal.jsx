import '../assets/all.scss';
import { Modal } from "bootstrap";
import Input from '../conponents/Input';
import ButtonTipModal from "../conponents/TipModal";
import Breadcrumb from '../conponents/Breadcrumb';

import { useForm, useWatch } from "react-hook-form";
import { useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

function Personal() {
  const breadcrumb = [
    { name: '首頁', path: "/" },
    { name: '會員資訊', path: "/Personal" },
  ];

  const navigate = useNavigate();
  const successModalRef = useRef();
  const passwordModalRef = useRef();
  const passwordModal = useRef();

  // 主表單
  const {
    register: mainRegister,
    handleSubmit: mainHandleSubmit,
    control: mainControl,
    formState: { errors: mainErrors },
  } = useForm({ mode: 'onTouched' });

  const onMainSubmit = (data) => {
    console.log("主表單資料", data);
    successModalRef.current.open();
  };

  // 密碼表單
  const {
    register: passwordRegister,
    handleSubmit: passwordHandleSubmit,
    control: passwordControl,
    formState: { errors: passwordErrors },
  } = useForm({ mode: 'onTouched' });

  const onPasswordSubmit = (data) => {
    console.log("密碼表單資料", data);
    passwordModal.current.hide(); // 提交成功關閉 Modal
  };

  // 監看表單狀態
  const watchMain = useWatch({ control: mainControl });
  const watchPassword = useWatch({ control: passwordControl });

  // 初始化 Bootstrap Modal
  useEffect(() => {
    passwordModal.current = new Modal(passwordModalRef.current);
  }, []);

  return (
    <div>
      <Breadcrumb breadcrumbs={breadcrumb} />

      <form onSubmit={mainHandleSubmit(onMainSubmit)}>
        <div className="mb-3 w-100" style={{ maxWidth: "600px" }}>
          <Input
            id="userID"
            type="text"
            errors={mainErrors}
            labelText="會員編號"
            register={mainRegister}
            placeholderTet="使用者名稱"
            disabled={true}
          />
        </div>

        <div className="mb-3 w-100" style={{ maxWidth: "600px" }}>
          <Input
            id="email"
            type="email"
            labelText="Email(帳號)"
            errors={mainErrors}
            register={mainRegister}
            placeholderTet="Email"
            disabled={true}
          />
        </div>

        <div className="mb-3 w-100" style={{ maxWidth: "600px" }}>
          <Input
            id="name"
            type='text'
              errors={mainErrors}
              labelText='使用者名稱'
              register={mainRegister}
              rules={{
                //必填
                required: '使用者名稱為必填', 
                maxLength: {
                  value: 10,
                  message: '使用者名稱長度不超過 10',
                },
              }}
              placeholderTet = "使用者名稱"
          />
        </div>

        <div className="row g-3" style={{ maxWidth: "600px"}}>
            {/* 第一列，四個欄位 */}
            <div className="col-6 me-auto">
              <button
                type="button"
                className="btn btn-outline-dark w-100"
                onClick={() => navigate("/")}
              >
                取消
              </button>
            </div>
            <div className="col-6 ">
                <button
                  type="submit"
                  className="btn btn-dark w-100"
                >
                  修改完成
                </button>
            </div>
        </div>

      </form>

      


      <ButtonTipModal ref={successModalRef} title="提示標題" info="修改成功" />


      <button
        type="button"
        className="btn btn-danger mt-3 w-100"
        style={{ maxWidth: "600px" }}
        onClick={() => passwordModal.current.show()} // 提交成功關閉 Modal}
      >
        修改密碼
      </button>
        
      {/* 密碼 Modal */}
      <div className="modal fade" tabIndex="-1" ref={passwordModalRef}>
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={passwordHandleSubmit(onPasswordSubmit)}>
              <div className="modal-header">
                <h5 className="modal-title">修改密碼</h5>
              </div>
              <div className="modal-body">
                <div className='mb-3 w-100' style={{maxWidth: 600+"px"}}>
                  <Input
                    id="password"
                    type="password"
                    labelText="密碼"
                    errors={passwordErrors}
                    register={passwordRegister}
                    rules={{
                      required: '密碼為必填',
                      minLength: { value: 6, message: '不少於 6 碼' },
                      maxLength: { value: 12, message: '不超過 12 碼' },
                    }}
                    placeholderTet="密碼"
                  />
                </div>
                <div className='mb-3 w-100' style={{maxWidth: 600+"px"}}>
                  <Input
                    id="repassword"
                    type="password"
                    labelText="確認密碼"
                    errors={passwordErrors}
                    register={passwordRegister}
                    rules={{
                      required: '請再次輸入密碼',
                      minLength: { value: 6, message: '不少於 6 碼' },
                      maxLength: { value: 12, message: '不超過 12 碼' },
                    }}
                    placeholderTet="再次輸入密碼"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-dark"
                  onClick={() => passwordModal.current.hide()}
                >
                  取消
                </button>
                <button type="submit" className="btn btn-dark">
                  確認修改
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Personal;
