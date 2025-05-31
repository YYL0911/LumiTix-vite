import { Modal } from "bootstrap"; // 手動導入 Bootstrap 的 Modal
import { useEffect, useRef, forwardRef, useImperativeHandle, } from "react";
import { useNavigate } from "react-router-dom";

const TipModal = forwardRef(
  ({ title, info,  navigatePath = "/", changePage = false}, ref) => {
  const navigate = useNavigate();
  const modalRef = useRef(null)
  const myModal = useRef(null);
  const isFirstRender = useRef(true); // 記錄是否是第一次渲染

  // 暴露給父元件的函式
  useImperativeHandle(ref, () => ({
    open: () =>{
      myModal.current.show()
      if(changePage){
        setTimeout(() => {
          myModal.current.hide()
          navigate(navigatePath); // 未登入則跳轉到  頁面
        }, 3000)
      }
    } 
  }));

  useEffect(() => {
    myModal.current = new Modal(modalRef.current);

    if (isFirstRender.current) {
      isFirstRender.current = false; // 更新為 false，代表已執行過
      // console.log("✅ useEffect 只執行一次");

      myModal.current._element.addEventListener("hidden.bs.modal", () => {
        if(changePage){
            navigate(navigatePath); // 未登入則跳轉到  頁面
        }
      });
      return () => {
        // 移除事件監聽
        myModal.current._element.removeEventListener("hidden.bs.modal", () => {
        });
      };
    }
      
    }, []);
  
  return (
    <>
        <div className="modal fade" ref={modalRef} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">{title}</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <pre>{info}</pre>
              </div>
            </div>
          </div>
        </div>
    </>
  )
})

export default TipModal;