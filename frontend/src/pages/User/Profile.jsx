import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react'
import api from '../../api'
import UserProfile from '../../components/common/UserProfile';
import Deliverylist from '../../components/common/Deliverylist';
import Navbar from '../../components/Navbar';
import Courierlist from '../../components/common/Courierlist';
import Footer from '../../components/Footer'
import Ridelist from '../../components/common/Ridelist';
import MyJoinlist from '../../components/common/Ride/MyJoinlist';


export default function Profile() {
  // In a real application, you would fetch this data from an API or database
  const [user, setUser] = useState(null);
  const [profile,setProfile] = useState(null)
  const [error, setError] = useState();
  const [deliveries, setDeliveries] = useState(null)
  const [couriers,setCouriers] = useState(null)
  const [rides,setRides] = useState(null)
  const [joins,setJoins] = useState(null)
  const navigate = useNavigate()
  
  useEffect(() => {
    const fetchprofile = async () => {

      navigator.geolocation.getCurrentPosition(function(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log("Latitude: " + latitude + ", Longitude: " + longitude);
    });
      

      console.log('hello');
      try {
        const response = await api.get(`/profile`)
        console.log('response',response)
        if (response.status === 200) {
          setUser(response.data.user)
          setProfile(response.data.profile)
          setDeliveries(response.data.deliveries)
          setCouriers(response.data.couriers)
          setRides(response.data.rides)
          setJoins(response.data.partner)
          console.log(user)
        } else {
          setError('error occured while fetching user profile')
        }
      } catch (error) {
        console.log('An unexpected errror occured');
      }
    };

    fetchprofile()
  }, []);



  if (!user) {
    console.log(user,'uuuuuuuuuuuuuu')

    return (
      <>

      <div className="p-6">
        <p>Loading...</p>
      </div>
      </>
    ); // Show loading message if user data is null
  }


  const handlemailverify = async (e) =>{
    e.preventDefault();
    try {
      const response = await api.post('resend_otp/',{
        email:user.email,
      });
      if (response.status >= 200 && response.status < 300){
        navigate('/verifyotp', {
          state: { email: user.email },
        });
      }
    }catch (error){
      console.log('email varification failed')
    }
   
  }

 


  return (
    <>
    <Navbar />
        < UserProfile user={user} profile={profile} deliveries={deliveries}/>


{user.email_verified ? (''):(
        <div className="mt-4 text-left pl-4">
          <p  className=" text-gray-600 font-semibold py-4">Your email is not verified, verify to use our services.</p>
      <button
        className="px-6 py-2 bg-blue-600 text-white rounded-md"
        onClick={handlemailverify}
      >
        Verify Email
      </button>
    </div>

)}


        

<section className="mt-10">
{deliveries.length > 0 ? (
      <>
  <div className="bg-white shadow-md rounded-lg">
    {/* Heading */}

   
    <h1 className="text-2xl font-semibold text-white bg-orange-600 rounded-t-lg px-6 py-4">
      My Requested Deliveries
    </h1>

    {/* Table */}
    <div className="p-4">
    
            <Deliverylist deliveries={deliveries} />
           
    </div>
    </div>
    </>
     ) : (
      <p className="text-center text-gray-600 font-semibold py-4">You haven't requested any deliveries yet.</p>
    )}
 
  
</section>
<section className="mt-10">
{couriers.length > 0 ? (
    <>
  <div className="bg-white shadow-md rounded-lg">
    {/* Heading */}
   
 
   <h1 className="text-2xl font-semibold text-white bg-orange-600 rounded-t-lg px-6 py-4">
      My Courier
    </h1>

    {/* Table */}
    <div className="p-4">
   
            <Courierlist couriers={couriers} />
         
    </div>
    </div>
  </>  
  ) : (
    <p className="text-center text-gray-600 font-semibold py-4">You haven't been a courier.</p>
    )}
 
</section>

<section className="mt-10">
{rides.length > 0 ? (
      <>
  <div className="bg-white shadow-md rounded-lg">
    {/* Heading */}

   
    <h1 className="text-2xl font-semibold text-white bg-orange-600 rounded-t-lg px-6 py-4">
      My Rides
    </h1>

    {/* Table */}
    <div className="p-4">
    
            <Ridelist rides={rides} />
           
    </div>
    </div>
    </>
     ) : (
      <p className="text-center text-gray-600 font-semibold py-4">You haven't had any rides yet.</p>
    )}
 
  
</section>


<section className="mt-10">

{rides.length > 0 ? (
      <>
  <div className="bg-white shadow-md rounded-lg">
    {/* Heading */}

   
    <h1 className="text-2xl font-semibold text-white bg-orange-600 rounded-t-lg px-6 py-4">
      Ride join requests
    </h1>

    {/* Table */}
    <div className="p-4">
    
            <MyJoinlist joins={joins} />
           
    </div>
    </div>
    </>
     ) : (
      <p className="text-center text-gray-600 font-semibold py-4">You haven't had any rides yet.</p>
    )}
 
  
</section>
<Footer />
        </>

     
  )
}

