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
          <Route path='/' element = {<Test></Test>}></Route>
          <Route path='/login' element = {<Login></Login>}></Route>
          <Route path='/register' element = {<Register></Register>}></Route>
          <Route path='/allEvents' element = {<AllEvents></AllEvents>}></Route>

          <Route path='/personal' element = {
              <PrivateRoute roles={['General']}>
                <Personal />
              </PrivateRoute>}>
          </Route>

          <Route path='/events' element = {
              <PrivateRoute roles={['Organizer']}>
                <Events />
              </PrivateRoute>}>
          </Route>

          <Route path="/activeInfo/:id" element={<ActiveInfo />} />
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
