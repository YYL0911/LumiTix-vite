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
import EventDetail from './pages/Organizer/EventDetail';
import TicketScaner from './pages/Organizer/TicketScaner';
import TicketScanerResult from './pages/Organizer/TicketScanerResult';
import EventFormPage from './pages/Organizer/EventFormPage';
import CollectEvent from './pages/User/CollectEvent';

import Payments from './pages/Payments';
import PaymentResult from './pages/PaymentResult';
import Callback from './pages/Callback';

import EventsList from './pages/Admin/EventsList';
import EventReviewPage from "./pages/Admin/EventReviewPage";
import UserList from './pages/Admin/UserList';
import UserInfo from './pages/Admin/UserInfo';
import EventRevenue from './pages/Admin/EventRevenue';

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
          <Route path="/eventInfo/:id" element={<EventInfo />} />

          {/* 只有使用者可以看的頁面 */}
          <Route element={<PrivateRoute roles={["General"]} />}>
            <Route path="/personal" element={<Personal />}></Route>
            <Route path="/tickets" element={<Tickets></Tickets>}></Route>
            <Route path="/ticketInfo/:id" element={<TicketDetailPage />} />
            <Route path="/eventInfo/:id/payments" element={<Payments />} />
            <Route path="/tickets/:id/payment_result" element={<PaymentResult />} />
            <Route path="/collectEvent" element={<CollectEvent />} />
          </Route>

          {/* 只有活動方可以看的頁面 */}
          <Route element={<PrivateRoute roles={["Organizer"]} />}>
            <Route path="/events" element={<Events />}></Route>
            <Route path="/ticketScaner" element={<TicketScaner />}></Route>
            <Route path="/ticketScanerResult" element={<TicketScanerResult />}></Route>
            <Route path="/organizer/event/new" element={<EventFormPage />} />
            <Route path="/organizer/event/edit/:eventId" element={<EventFormPage />} />
            <Route path="/eventDetail/:id" element={<EventDetail />} />
          </Route>

          {/* 只有平台方可以看的頁面 */}
          <Route element={<PrivateRoute roles={["Admin"]} />}>
            <Route path="/userList" element={<UserList />} />
            <Route path="/userList/:userId" element={<UserInfo />} />
            <Route path="/eventsList" element={<EventsList></EventsList>}></Route>
            <Route path="/eventReview/:eventId" element={<EventReviewPage />} />
            <Route path="/eventRevenue/:id" element={<EventRevenue></EventRevenue>}></Route>
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


