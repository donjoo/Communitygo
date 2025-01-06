import React, { useEffect, useState } from 'react';
import Footer from '../../../components/Footer';
import Navbar from '../../../components/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api';
import Navigation from '../../../components/map/Navigation';
import { useSelector } from 'react-redux';
import ChatRoom from '../../Chat/ChatRoom';

function PartnerDetails() {
  const ride_id = useSelector((state) => state.ride.id);
  const { partnerId } = useParams();
  const [ride, setRide] = useState();
  const [partner, setPartner] = useState(); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Define PartnerDetail inside the component
  const PartnerDetail = async () => {
    try {
      const response = await api.get(`${partnerId}/partnerdetail`);
      setPartner(response.data.partner);
      setUser(response.data.user);
      setRide(response.data.ride);

      console.log(response.data.partner.pickup_longitude,'jj');
      console.log(response.data.ride.route.start_longitude);

      setEnd([response.data.partner.pickup_longitude, response.data.partner.pickup_latitude]);
      setStart([response.data.ride.route.start_longitude, response.data.ride.route.start_latitude]);
    } catch (error) {
      console.error("Error fetching partner details:", error);
      setError("Failed to Fetch partner details.");
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  useEffect(() => {
    PartnerDetail(); // Call PartnerDetail when component mounts or partnerId changes
  }, [partnerId]);

  const Pickedup = async () => {
    const response = await api.post(`partner/${partnerId}/pickup/`);
    if (response.status === 200) {
      console.log('partner picked up');
      await PartnerDetail(); // Call PartnerDetail again to refresh data
    }
  };

  const Dropedoff = async () => {
    const response = await api.post(`partner/${partnerId}/dropoff/`);
    if (response.status === 200) {
      navigate(`/joinrequests`);
    }
  };

  if (loading) {
    return (
      <>
        <p>Loading...</p>
        <p>{start}</p>
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="mt- flex flex-1 overflow-hidden">
        {/* Right Side: Details */}
        <div className="flex-1 p-6 bg-white overflow-y-auto">
          <div className="border border-gray-300 rounded-lg shadow-md p-6 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Pickup Partner</h2>
            
            {/* From Address */}
            <div className="mb-2">
              <span className="font-medium text-gray-600">Username: </span>
              <span className="text-gray-800">{user?.username}</span>
            </div>
            <div className="mb-2">
              <span className="font-medium text-gray-600">Name:</span>
              <span className="text-gray-800">{user?.first_name} {partner?.user?.last_name}</span>
            </div>
            <div className="mb-2">
              <span className="font-medium text-gray-600">Phone Number:</span>
              <span className="text-gray-800">{user?.phone_number}</span>
            </div>

            <h3 className="text-lg font-bold text-gray-700 mt-4">Details</h3>
            <div className="mb-2">
              <span className="font-medium text-gray-600">Pickup location: </span>
              <span className="text-gray-800">{partner?.pickup || 'N/A'}</span>
            </div>
            <div className="mb-2">
              <span className="font-medium text-gray-600">Dropoff location: </span>
              <span className="text-gray-800">{partner?.dropoff || 'N/A'}</span>
            </div>
            <div className="mb-2">
              <span className="font-medium text-gray-600">Seats: </span>
              <span className="text-gray-800">{partner?.seats || 'N/A'}</span>
            </div>
            <div className="mb-2">
              <span className="font-medium text-gray-600">Status: </span>
              <span className="text-gray-800">{partner?.status || 'N/A'}</span>
            </div>

            {/* Chat Room Component */}
            {user && (
              <ChatRoom receiverUsername={user.username} />
            )}

            {/* Pickup/Dropoff Buttons */}
            <div className="mt-6">
              {partner.status === "droppedoff" ? (
                <p className="font-medium text-red-600">Partner Dropped Off</p>
              ) : partner.is_pickedup ? (
                <button
                  onClick={Dropedoff}
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Dropped Off
                </button>
              ) : (
                <button
                  onClick={Pickedup}
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Picked Up
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Left Side: Map */}
        <div className="mt-4 mb-4 mr-6 flex-1 bg-gray-100">
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

export default PartnerDetails;
