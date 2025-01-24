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
import VerifyOtp from "./pages/User/VerifyOtp";
import { GoogleOAuthProvider } from '@react-oauth/google';
import {google_id} from "./constants/constants"
import PhoneNumberInput from "./pages/User/PhoneNumber";
import Make_a_ride from "./pages/RideShare/Rider/Make_a_ride";
import { Router } from "lucide-react";
import JoinRequests from "./pages/RideShare/Rider/JoinRequests";
import Join_a_ride from "./pages/RideShare/RidePartner/Join_a_ride";
import RideJoin from "./pages/RideShare/RidePartner/RideJoin";
import PartnerDetails from "./pages/RideShare/Rider/Partner";
import RideRoute from "./pages/RideShare/Rider/Route";
import RideDetails from "./pages/RideShare/Rider/RideDetails";
import RideDetail from "./pages/RideShare/RidePartner/Ridedetail";
import DeliveryPayment from "./pages/Delivery/Payment/Payment";
import Earnings from "./pages/User/MyEarnings";
import PaymentPage from "./pages/RideShare/RidePartner/payment";
import PasswordOtp from "./pages/User/PasswordOtp";
import ChangePassword from "./pages/User/ChangePassword";
import DashboardPage from "./pages/Admin/dashboard/page";
import {DashboardLayout} from "./pages/Admin/dashboard/layout";
import RideManagement from "./pages/Admin/Ridemanagement";
import AdminRideDetail from "./pages/Admin/RideDetail";
import AdminPartnerDetails from "./pages/Admin/Ride/partnerdetails";
import AboutUs from "./components/About_us";

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
     <GoogleOAuthProvider clientId={google_id}>
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
                <Route path="/aboutus" element={<AboutUs />} />
        
        
        <Route path='/verifyotp' element={< VerifyOtp />} />
        <Route path="/" element={<Home />}/>
        <Route path="/logout" element={<Logout />} /> {/* Redirects and clears localStorage */}     
        <Route path="/request-delivery" element={<RequestDelivery />} />
        <Route path="/delivery/payment/:deliveryId" element={<DeliveryPayment />} />
        <Route path='/deliverydetail/:deliveryId' element = {< DeliveryDetails />} />

        <Route path="/deliverylist" element={< DeliveryList />} />
        <Route path="/deliverysearch" element = {< DeliverySearch />} />
        <Route path='/admin/login' element={< AdminLogin />} />
        <Route path='/phonenumberinput' element={<PhoneNumberInput />} />
        <Route path='/dashboard' element={<DashboardLayout > <DashboardPage /> </DashboardLayout>} />
        <Route path='/usermanagement' element={<DashboardLayout > <Usermanagement /> </DashboardLayout>} />
        <Route path='/deliverymanagement' element={ <DashboardLayout >< DeliveryManagement/> </DashboardLayout>} />
        <Route path='/profile' element={< Profile />} />
        <Route path ='/user/:id' element={ <DashboardLayout > < UserDetail /> </DashboardLayout>} />
        <Route path='/admindeliverydetail/:deliveryId' element = {<DashboardLayout > < AdminDeliveryDetails /> </DashboardLayout>} />
        <Route path='/courier_currlocation/:deliveryId' element = {< Currentlocation />} />
        <Route path='/pickuplocation/:deliveryId' element={<Pickuplocation />}/>
        <Route path='/dropofflocation/:deliveryId' element={< Dropofflocation />}/>
        <Route path='/courierdetail/:deliveryId' element={<Courier_details />} />
        <Route path='/otp/:deliveryId/:method' element={<OtpCard />} />
        <Route path='/couriercompleted/:deliveryId' element={<CourierCompleted />} />



        <Route path='/my_earnings' element={<Earnings />} />
        <Route path='/changepassword/send-otp' element={<PasswordOtp />} />
        <Route path='/change-password' element={<ChangePassword />} />
        



        <Route path='/ridemanagement' element= { <DashboardLayout > <RideManagement />  </DashboardLayout>} />
        <Route path='/ridedetail/:ride_Id' element= { <DashboardLayout > <AdminRideDetail />  </DashboardLayout>} />
        <Route path='/Adminpartnerdetail/:partnerId' element={ <DashboardLayout > <AdminPartnerDetails /> </DashboardLayout> } /> 


    


         {/* RideSharing */}

         <Route path='/make_a_ride' element={<Make_a_ride />} />
         <Route path='/joinrequests/' element={<JoinRequests />} />
         <Route path="/join_a_ride" element={<Join_a_ride />} />
         <Route path="/ride/payment/:partnerId" element={<PaymentPage />} />

         <Route path='/ridejoin/:ride_id' element = {<RideJoin />} />
         <Route path='/partnerdetail/:partnerId' element={<PartnerDetails />} /> 
         <Route path="/rideroute" element={<RideRoute />} />
         < Route path="/ridedetails" element={<RideDetails />} />
         <Route path="/partner/ridedetail/:partner_id" element={<RideDetail />}/>
         </Routes>
         </GoogleOAuthProvider>

    </BrowserRouter>
  );
}

export default App;
