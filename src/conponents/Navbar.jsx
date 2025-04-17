import { Link } from "react-router-dom"
import logo from "../assets/img/Frame 1000005811.png"
import { useAuth } from '../contexts/AuthContext';

import userIcon from "../assets/img/userIcon.png"

export default function Navbar() { 
  const { userRole, logout } = useAuth();
  return (
    <>
      <nav className="navbar  bg-white px-5 d-flex align-items-center">
        <div className="container-fluid container">
          <Link className="navbar-brand" to='/'>
            <img src={logo} alt="Logo" className="d-inline-block align-text-top"  />
          </Link>

            <ul className="navbar-nav flex-row gap-4">

              {/* <li className="nav-item dropdown customNavbar-dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Dropdown
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><a className="dropdown-item" href="#">Action</a></li>
                  <li><a className="dropdown-item" href="#">Another action</a></li>
                  <li><a className="dropdown-item" href="#">Something else here</a></li>
                </ul>
              </li> */}

              <li className="nav-item ">
                <Link className="nav-link"  to='/'>所有活動</Link>
              </li>

              
              {/* <li className="nav-item  bg-danger px-3">
                <Link className="nav-link text-white"  to='/Login'>登入</Link>
              </li> */}


              {userRole === 'admin' && <li className="nav-item">管理者功能</li>}
              {userRole === 'member' && 
                  <li className="nav-item dropdown customNavbar-dropdown">
                    <a className=" icon-link nav-link dropdown-toggle bg-login px-3 border border-2 border-black"  role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      {/* <svg xmlns="http://www.w3.org/2000/svg" class="bi" viewBox="0 0 16 16" aria-hidden="true">  
                        <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
                      </svg> */}
                      <img src={userIcon} alt="按鈕" />
                      名稱
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li className="nav-item ps-3"><Link className="nav-link"  to='/Personal'>會員資料</Link></li>
                      <li className="nav-item ps-3"><Link className="nav-link"  to=''>票卷管理</Link></li>
                    </ul>
                </li>
              }
              {userRole ? ("") : (
                <li className="nav-item  bg-danger px-3">
                  <Link className="nav-link text-white"  to='/Login'>登入</Link>
                </li>
              )}


            </ul>
        </div>
      </nav>
      <hr />
    </>

  )
}
