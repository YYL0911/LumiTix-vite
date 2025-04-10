import { Link } from "react-router-dom"
import logo from "../assets/img/Frame 1000005811.png"

export default function Navbar() { return (
<>
  <nav className="navbar  bg-white px-5 d-flex align-items-center">
    <div className="container-fluid container">
      <Link className="navbar-brand" to='/'>
        <img src={logo} alt="Logo" className="d-inline-block align-text-top"  />
      </Link>

        <ul className="navbar-nav flex-row gap-4">

          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Dropdown
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><a className="dropdown-item" href="#">Action</a></li>
              <li><a className="dropdown-item" href="#">Another action</a></li>
              <li><a className="dropdown-item" href="#">Something else here</a></li>
            </ul>
          </li>

          <li className="nav-item ">
            <Link className="nav-link"  to='/Personal'>會員資料</Link>
          </li>

          <li className="nav-item  bg-danger px-3">
            <Link className="nav-link text-white"  to='/Login'>登入</Link>
          </li>


        </ul>
    </div>
  </nav>
  <hr />
</>









)
}
