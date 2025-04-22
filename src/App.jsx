import './assets/all.scss'

import Navbar from './conponents/Navbar';
import Footer from './conponents/Footer';
import Top from './conponents/Top';
import {Routes, Route} from 'react-router-dom';

import PrivateRoute from './conponents/PrivateRoute';

import Test from './pages/test'

import Login from './pages/Login';
import AllEvents from './pages/AllEvents';
import EventInfo from './pages/EventInfo';
import Register from './pages/User/Register';
import Personal from './pages/User/Personal';
import Events from './pages/Organizer/Events';
import ActiveInfo from './pages/Organizer/ActiveInfo';

const NotFound = () => <h1>404 - 頁面不存在</h1>;

function App() {
  
  return (
    <div className="page">
      <Navbar />
      <div className='container my-3 page-main'>
      {/* <Router > */}
        <Routes>
          <Route path='/Unauthorized' element = {<h1>您沒有訪問此頁面權限，請先登入</h1>}></Route>
          <Route path='/' element = {<Test></Test>}></Route>
          <Route path='/Login' element = {<Login></Login>}></Route>
          <Route path='/Register' element = {<Register></Register>}></Route>
          <Route path='/AllEvents' element = {<AllEvents></AllEvents>}></Route>

          <Route path='/Personal' element = {
              <PrivateRoute roles={['General Member']}>
                <Personal />
              </PrivateRoute>}>
          </Route>

          <Route path='/Events' element = {
              <PrivateRoute roles={['Customer']}>
                <Events />
              </PrivateRoute>}>
          </Route>

          <Route path="/ActiveInfo/:id" element={<ActiveInfo />} />
          <Route path="/evevtInfo/:id" element={<EventInfo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
      <Top />
        
    </div>
    // </HashRouter>
  );
}

export default App;
