import './assets/all.scss'

import Navbar from './conponents/Navbar';
import Footer from './conponents/Footer';
import {Routes, Route} from 'react-router-dom'

import Test from './pages/test'
import Register from './pages/Register';
import Login from './pages/Login';
import Personal from './pages/Personal';

const NotFound = () => <h1>404 - 頁面不存在</h1>;

function App() {
  
  return (
    <div className="page">
      <Navbar />
      <div className='container my-3 page-main'>
      {/* <Router > */}
        <Routes>
          <Route path='/' element = {<Test></Test>}></Route>
          <Route path='/Register' element = {<Register></Register>}></Route>
          <Route path='/Login' element = {<Login></Login>}></Route>
          <Route path='/Personal' element = {<Personal></Personal>}></Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
        
    </div>
    // </HashRouter>
  );
}

export default App;
