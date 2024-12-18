// import react from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProtectedRoute from "./components/protectedroutes/privateroutes";
import Logout from "./components/Logout";
import RequestDelivery from "./pages/Delivery/RequestDelivery";
import DeliveryList from "./pages/Delivery/Deliverylist";
import DeliverySearch from "./pages/Delivery/Courier/SearchDelivery";
import AdminLogin from './pages/Admin/AdminLogin'
import Dashboard from "./pages/Admin/Dashboard";
import Usermanagement from "./pages/Admin/Usermanagement";
import DeliveryManagement from "./pages/Admin/DeliveryManagement";
import Profile from "./pages/User/Profile";
import UserDetail from "./pages/Admin/user/Edituser";
import DeliveryDetails from "./pages/Delivery/Courier/DeliveryDetails";
import Pickuplocation from "./pages/Delivery/Courier/Pickuplocation";
import Courier_details from "./pages/Delivery/Courier/Courier_details";
import Currentlocation from "./pages/Delivery/Courier/Currentlocation";
import OtpCard from "./components/common/Otp";
import Navigation from "./components/map/Navigation";
import Dropofflocation from "./pages/Delivery/Courier/Dropofflocation";
import CourierCompleted from "./pages/Delivery/Courier/Delivery_complete";
import AdminDeliveryDetails from "./pages/Admin/AdminDeliverydetails";


function Signin(){
  // localStorage.clear()
  return <Login />
}

function RegisterAndLogout()  {
  // localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>


        {/* <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
        /> */}

        <Route path="/login" element={<Signin />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/" element={<Home />}/>
        <Route path="/logout" element={<Logout />} /> {/* Redirects and clears localStorage */}     
        <Route path="/request-delivery" element={<RequestDelivery />} />
        <Route path="/deliverylist" element={< DeliveryList />} />
        <Route path="/deliverysearch" element = {< DeliverySearch />} />
        <Route path='/admin/login' element={< AdminLogin />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/usermanagement' element={<Usermanagement />} />
        <Route path='/deliverymanagement' element={< DeliveryManagement/>} />
        <Route path='/profile' element={< Profile />} />
        <Route path ='/user/:id' element={< UserDetail />} />
        <Route path='/deliverydetail/:deliveryId' element = {< DeliveryDetails />} />
        <Route path='/admindeliverydetail/:deliveryId' element = {< AdminDeliveryDetails />} />
        <Route path='/courier_currlocation/:deliveryId' element = {< Currentlocation />} />
        <Route path='/pickuplocation/:deliveryId' element={<Pickuplocation />}/>
        <Route path='/dropofflocation/:deliveryId' element={< Dropofflocation />}/>
        <Route path='/courierdetail/:deliveryId' element={<Courier_details />} />
        <Route path='/otp/:deliveryId/:method' element={<OtpCard />} />
        <Route path='/couriercompleted/:deliveryId' element={<CourierCompleted />} />
         </Routes>
    </BrowserRouter>
  );
}

export default App;
