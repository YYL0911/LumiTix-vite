import { Link } from "react-router-dom"
import logo from "../assets/img/Frame 1000005811.png"
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useRef, useState } from 'react';

import userIcon from "../assets/img/userIcon.png"
import organizerIcon from "../assets/img/organizerIcon.png"
import adminIcon from "../assets/img/adminIcon.png"


export default function Navbar() { 
  const { userRole, userName, logout ,setHeaderHeight} = useAuth();
  const headerRef = useRef(null)

  useEffect(()=>{
    const updateHeight = () => {
      if(headerRef.current){
        setHeaderHeight(headerRef.current.offsetHeight)
      }
    }
    updateHeight()
    window.addEventListener('resize', updateHeight)

    return () => {
      window.removeEventListener('resize', updateHeight)
    }
  })
  
  return (
    <div ref ={headerRef} className="position-sticky z-2 top-0 bg-white" >
      <nav className="navbar bg-white container d-flex align-items-center" >
        <div className="container-fluid ">
          <Link className="navbar-brand" to='/'>
          
            <img src={logo} alt="Logo" className="d-inline-block align-text-top logo-nav-cus"/>
          </Link>
            <ul className="navbar-nav flex-row gap-4 ms-auto">

              <li className="nav-item ">
                <Link className="nav-link"  to='/allEvents'>所有活動</Link>
              </li>

              {/* 活動方 */}
              {userRole === 'Organizer' && 
                <li className="nav-item dropdown customNavbar-dropdown">
                  <a className=" icon-link nav-link dropdown-toggle bg-login px-3 border border-2 border-black"  role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    
                    <img src={organizerIcon} alt="icon" />
                    {userName}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
<<<<<<< HEAD
                    <li className="nav-item ps-3"><Link className="nav-link"  to='/organizer/event/new'>活動新增</Link></li>
                    <li className="nav-item ps-3"><Link className="nav-link"  to='/events'>活動訂單</Link></li>
                    <li className="nav-item ps-3"><Link className="nav-link"  to='/ticketScaner'>驗票</Link></li>
                    <li className="nav-item ps-3" onClick={() => logout()}><Link className="nav-link"  to='/'>登出</Link></li>
=======
                    <li className="nav-item ps-3 dropdown-item"><Link className="nav-link"  to='/organizer/event/new'>活動新增/管理</Link></li>
                    <li className="nav-item ps-3 dropdown-item"><Link className="nav-link "  to='/events'>活動清單</Link></li>
                    <li className="nav-item ps-3 dropdown-item"><Link className="nav-link"  to='/ticketScaner'>驗票</Link></li>
                    <li className="nav-item ps-3 dropdown-item" onClick={() => logout()}><Link className="nav-link"  to='/'>登出</Link></li>
>>>>>>> main
                  </ul>
                </li>
              }

              {/* 平台方 */}
              {userRole === 'Admin' && 
                <li className="nav-item dropdown customNavbar-dropdown">
                  <a className=" icon-link nav-link dropdown-toggle bg-login px-3 border border-2 border-black"  role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    
                    <img src={adminIcon} alt="icon" />
                    {userName}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li className="nav-item ps-3 dropdown-item"><Link className="nav-link"  to='/userList'>一般會員管理</Link></li>
                    <li className="nav-item ps-3 dropdown-item"><Link className="nav-link"  to='/eventsList'>活動管理</Link></li>
                    <li className="nav-item ps-3 dropdown-item" onClick={() => logout()}><Link className="nav-link"  to='/'>登出</Link></li>
                  </ul>
                </li>
              }

              {/* 使用者 */}
              {userRole === 'General' && 
                  <li className="nav-item dropdown customNavbar-dropdown">
                    <a className=" icon-link nav-link dropdown-toggle bg-login px-3 border border-2 border-black"  role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      
                      <img src={userIcon} alt="icon" />
                      {userName}
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li className="nav-item ps-3 dropdown-item"><Link className="nav-link"  to='/personal'>會員資料</Link></li>
                      <li className="nav-item ps-3 dropdown-item"><Link className="nav-link"  to='/tickets'>票卷管理</Link></li>
                      <li className="nav-item ps-3 dropdown-item" onClick={() => logout()}><Link className="nav-link"  to='/'>登出</Link></li>
                    </ul>
                </li>
              }

              
              {userRole ? ("") : (
                <li className="nav-item  bg-danger px-3">
                  <Link className="nav-link text-white"  to='/login'>登入</Link>
                </li>
              )}
            </ul>
        </div>
      </nav>
      <hr />
    </div>

  )
}