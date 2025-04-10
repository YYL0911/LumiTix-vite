import React from 'react';
import logo from "../assets/img/Frame 1000005811.png"
import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer>
        <hr />
        <div className="my-4">
            <div className="container">
                <div className="row">
                    {/* 第一列，四個欄位 */}
                    <div className="col-lg-3 my-2 my-lg-0">
                        <h5>票務服務單位</h5>
                        <ul className="footer-list list-unstyled">
                        <li>
                            <Link className="navbar-brand" to='/'>
                                <img src={logo} alt="Logo" className="d-inline-block align-text-top"  />
                            </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="col-lg-3 my-2 my-lg-0">
                        <h5>客服專線</h5>
                        <ul className="footer-list list-unstyled">
                        <li>(02) 1234-5678</li>
                        </ul>
                    </div>
                    <div className="col-lg-3 my-2 my-lg-0">
                        <h5>客服信箱</h5>
                        <ul className="footer-list list-unstyled">
                        <li>LumiTix@gmail.com</li>
                        </ul>
                    </div>
                    <div className="col-lg-3 my-2 my-lg-0">
                        <h5>客服時間</h5>
                        <ul className="footer-list list-unstyled">
                            <li>周一~週五 10:00 - 12:30</li>
                            <li>13:30 - 18:00(適逢國定假日暫停服務)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>


        <div className="bg-dark text-white py-3">
            
        <div className="container">
                <div className="row">
                {/* 第二列 */}
                <div className="col-lg-4 col-12 text-left">
                    &copy; 權利說明 LumiTix Copyright
                </div>
                <div className="col-lg-8  col-12 copyText">
                    <div>使用本網站即表示接受條款和條件以及隱私政策以及程式餅乾政策以及行動隱私政策</div>
                </div>
                </div>
            </div>
        </div>
        
    </footer>
  );
}

export default Footer;
