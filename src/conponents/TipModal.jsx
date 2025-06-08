import { forwardRef, useImperativeHandle, useState } from "react";
import { useNavigate } from "react-router-dom";
// import "./TipModal.css"; // 👈 自行控制動畫與樣式（見下方）

const TipModal = forwardRef(({ title, info, navigatePath = "/", changePage = false }, ref) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useImperativeHandle(ref, () => ({
    open: () => {
      setShow(true);

      if (changePage) {
        setTimeout(() => {
          setShow(false); // 關閉 modal
          setTimeout(() => {
            navigate(navigatePath); // 等動畫結束再跳頁
          }, 300); // 動畫時間需和 CSS 一致
        }, 3000); // 顯示時間
      }
    }
  }));

  const handleClose = () => {
    setShow(false);
  };

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show" />

      {/* Modal */}
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" onClick={handleClose} />
            </div>
            <div className="modal-body">
              <pre>{info}</pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default TipModal;