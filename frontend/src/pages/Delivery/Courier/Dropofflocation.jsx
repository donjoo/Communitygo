import React, { useEffect, useState } from 'react';
import Footer from '../../../components/Footer';
import Navbar from '../../../components/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api';
import Navigation from '../../../components/map/Navigation';

function Dropofflocation() {
  const {deliveryId} = useParams();
  const [delivery,setDelivery] = useState(null);
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(null);
  const [start,setStart] = useState(null);
  const [end,setEnd] = useState(null);
  const [user,setUser] = useState(null);
  const navigate = useNavigate()

   

    useEffect(() => {
      const DropoffDetails = async () => {
        try {
          const response = await api.get(`${deliveryId}/deliverydetail`);
          setDelivery(response.data.delivery);
          setUser(response.data.user)
          console.log(response.data.delivery.to_address.latitude,'latitiudeefj checkkk')
          setStart([response.data.delivery.from_address.longitude,response.data.delivery.from_address.latitude])
          setEnd([response.data.delivery.to_address.longitude,response.data.delivery.to_address.latitude])
         console.log(start,'startttt',end,'endddddd')
         
          console.log(response.data.courierd,'cccccccccccc');
        } catch (error) {
          console.error("Error fetching delivery details:",error);
          setError("Failed to Fetch delivery details.");
        } finally {
          setLoading(false);
        }
      };

      DropoffDetails();
    },[deliveryId]);


    const CourierCompleted =() => {
      const method = 'dropoff';
      navigate(`/otp/${deliveryId}/${method}`)
    }


    useEffect(() => {
      if (start && end) {
        console.log(delivery,'deliveryyyyyyyyyyyyyyyyyy')
        console.log(start, 'start updated');
        console.log(end, 'end updated');
      }
    }, [start, end]); 



  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className=" mt- flex flex-1 overflow-hidden">
        {/* Right Side: Details */}
        <div className="flex-1 p-6 bg-white overflow-y-auto">

          <div className="border border-gray-300 rounded-lg shadow-md p-6 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Dropoff Details</h2>
          
          {/* From Address */}
        
          <h3 className="text-lg font-bold text-gray-700 mt-4">Contact</h3>
          <div className="mb-2">
          <span className="text-gray-800">{user?.first_name} {user?.last_name}</span>

          </div>
          <div className="mb-2">
            <span className="text-gray-800">{user?.phone_number}</span>
          </div>
        
            <h3 className="text-lg font-bold text-gray-700 mt-4">Address</h3>
          <div className="mb-2">
            <span className="font-medium text-gray-600">Address Line 1: </span>
            <span className="text-gray-800">{delivery?.to_address?.address_line_1 || 'N/A'}</span>
          </div>
          <div className="mb-2">
            <span className="font-medium text-gray-600">City: </span>
            <span className="text-gray-800">{delivery?.to_address?.city || 'N/A'}</span>
          </div>
          <div className="mb-2">
            <span className="font-medium text-gray-600">State: </span>
            <span className="text-gray-800">{delivery?.to_address?.state || 'N/A'}</span>
          </div>
          <div className="mb-2">
            <span className="font-medium text-gray-600">Country: </span>
            <span className="text-gray-800">{delivery?.to_address?.country || 'N/A'}</span>
          </div>
          <div className="mb-2">
            <span className="font-medium text-gray-600">Postal Code: </span>
            <span className="text-gray-800">{delivery?.to_address?.postal_code || 'N/A'}</span>
          </div>
            


          {/* Delivery Status */}
          <div className="mb-2">
            <span className="font-medium text-gray-600">Status: </span>
            <span className="text-gray-800">{delivery?.status}</span>
          </div>
          
          {/* Package Size */}
          <div className="mb-2">
            <span className="font-medium text-gray-600">Package Size: </span>
            <span className="text-gray-800">{delivery?.package_size}</span>
          </div>

          <div className="mt-6">
          <button
            onClick={CourierCompleted} 
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            delivery completed
          </button>
        </div>

        </div>
    
        </div>

        {/* Left Side: Map */}
        <div className=" mt-4 mb-4 mr-6 flex-1 bg-gray-100">
          {/* <MapComponent /> */}
          {start && end ? (
        <Navigation startlocation={start} endlocation={end} />
      ) : (
        <div>Loading map...</div> // You can show a loading indicator here
      )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dropofflocation;
