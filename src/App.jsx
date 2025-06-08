import './assets/all.scss'

import Navbar from './conponents/Navbar';
import Footer from './conponents/Footer';
import Top from './conponents/Top';
import { Routes, Route } from 'react-router-dom';

import PrivateRoute from './conponents/PrivateRoute';

import Home from './pages/HomePage/Home';

import Login from './pages/Login';
import AllEvents from './pages/AllEvents';
import EventInfo from './pages/EventInfo';
import Register from './pages/User/Register';
import Personal from './pages/User/Personal';
import Tickets from './pages/User/Tickets';
import TicketDetailPage from "./pages/User/TicketDetailPage";
import Events from './pages/Organizer/Events';
import ActiveInfo from './pages/Organizer/ActiveInfo';
import TicketScaner from './pages/Organizer/TicketScaner';
import TicketScanerResult from './pages/Organizer/TicketScanerResult';
import EventFormPage from './pages/Organizer/EventFormPage';

import Callback from './pages/Callback';

import EventsList from './pages/Admin/EventsList';
import UserManagementList from './pages/Admin/UserManagementList';


const NotFound = () => <h1>404 - 頁面不存在</h1>;
const ErrorPage = () => <h1>error - 伺服器發生錯誤，請稍後再試</h1>;

function App() {

  return (
    <div className="page">
      <Navbar />
      {/* container */}
      <div className="page-main">
        {/* <Router > */}
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/register" element={<Register></Register>}></Route>
          <Route path="/allEvents" element={<AllEvents></AllEvents>}></Route>
          <Route path="/callback" element={<Callback></Callback>}></Route>
          <Route path="/evevtInfo/:id" element={<EventInfo />} />

          {/* 只有使用者可以看的頁面 */}
          <Route element={<PrivateRoute roles={["General"]} />}>
            <Route path="/personal" element={<Personal />}></Route>
            <Route path="/tickets" element={<Tickets></Tickets>}></Route>
            <Route path="/ticketInfo/:id" element={<TicketDetailPage />} />
          </Route>

          {/* 只有活動方可以看的頁面 */}
          <Route element={<PrivateRoute roles={["Organizer"]} />}>
            <Route path="/events" element={<Events />}></Route>
            <Route path="/ticketScaner" element={<TicketScaner />}></Route>
            <Route path="/ticketScanerResult" element={<TicketScanerResult />}></Route>
            <Route path="/activeInfo/:id" element={<ActiveInfo />} />
            <Route path="/organizer/event/new" element={<EventFormPage />} />
            <Route path="/organizer/event/edit/:eventId" element={<EventFormPage />} />
          </Route>

          {/* 只有活動方可以看的頁面 */}
          <Route element={<PrivateRoute roles={["Admin"]} />}>
            <Route path="/eventsList" element={<EventsList></EventsList>}></Route>
          </Route>

          <Route path="/ErrorPage" element={<ErrorPage />} />
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


