import React, { useEffect, useState } from 'react';
import Footer from '../../../components/Footer';
import Navbar from '../../../components/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api';
import Navigation from '../../../components/map/Navigation';
import { useSelector } from 'react-redux';

function RideRoute() {

  const ride_id = useSelector((state) => state.ride.id)
  const [ride,setRide] = useState();
  const [partner,setPartner] = useState(); 
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(null);
  const [start,setStart] = useState(null);
  const [end,setEnd] = useState(null);
  const [user,setUser] = useState(null);
  const navigate = useNavigate()


      

    useEffect(() => {
      const PartnerDetail = async () => {
        try {
          const response = await api.get(`ride/${ride_id}/route`);
          setPartner(response.data.partner);
          setUser(response.data.user)
          setRide(response.data.ride)
          
          console.log(response.data.partner.pickup_longitude,'jj')
          console.log(response.data.ride.route.start_longitude)

          setEnd([response.data.ride.route.end_longitude,response.data.ride.route.end_latitude])
          setStart([response.data.ride.route.start_longitude,response.data.ride.route.start_latitude])

        } catch (error) {
          console.error("Error fetching partner details:",error);
          setError("Failed to Fetch partner details.");
        } finally {
          setLoading(false);
        }
      };

      PartnerDetail();
    },[ride_id]);

    
 


    const ridecomplete = async () => {
      const response = await api.post(`ride/${ride_id}/complete/`);
      if (response.status === 200){
        navigate(`/ridedetails/${ride_id}`)
      }
    };

if (!user) {
    return (
        <>
        <p>Loading...</p>
        <p>{start}</p>
        </>
    )
}

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className=" mt- flex flex-1 overflow-hidden">
        {/* Right Side: Details */}
        <div className="flex-1 p-6 bg-white overflow-y-auto">

          <div className="border border-gray-300 rounded-lg shadow-md p-6 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-700 mb-4">your Ride Details</h2>
          
          {/* From Address */}
        
          <div className="mb-2">
          <span className="font-medium text-gray-600">username : </span>
            <span className="text-gray-800">{user?.username}</span>
          </div>
          <div className="mb-2">
          <span className="font-medium text-gray-600">Name :</span>
          <span className="text-gray-800">{user?.first_name} {partner.user?.last_name}</span>
          </div>
         
        
        
            <h3 className="text-lg font-bold text-gray-700 mt-4">Details</h3>
           <div className="mb-2">
            <span className="font-medium text-gray-600">Pickup location : </span>
            <span className="text-gray-800">{ride?.route.starting_point || 'N/A'}</span>
          </div>
          <div className="mb-2">
            <span className="font-medium text-gray-600">Dropoff location : </span>
            <span className="text-gray-800">{ride.route.endpoint || 'N/A'}</span>
          </div>
          <div className="mb-2">
            <span className="font-medium text-gray-600">Seats : </span>
            <span className="text-gray-800">{ ride.total_seats || 'N/A'}</span>
          </div>
          <div className="mb-2">
            <span className="font-medium text-gray-600">Status : </span>
            <span className="text-gray-800">{ ride.status|| 'N/A'}</span>
          </div>
         
            


          

          <div className="mt-6">

            {ride.is_completed ? (
                <p><span className="font-medium text-green-600">Ride Completed</span></p>
            ):(
          <button
            onClick={ridecomplete} 
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Destination reached
          </button>
        )}
        </div>

        </div>
    
        </div>

        {/* Left Side: Map */}
        <div className=" mt-4 mb-4 mr-6 flex-1 bg-gray-100">
          {start && end ? (
        <Navigation startlocation={start} endlocation={end} />
      ) : (
        <div>
        <div>Loading map...</div>
        <p>{start}</p>
        </div>
        // You can show a loading indicator here
      )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default RideRoute;
