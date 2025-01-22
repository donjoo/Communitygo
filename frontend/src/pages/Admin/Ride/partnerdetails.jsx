import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../api';
import Navigation from '../../../components/map/Navigation';

function AdminPartnerDetails() {
  const { partnerId } = useParams();
  const [ride, setRide] = useState(null);
  const [partner, setPartner] = useState(null);
  const [user, setUser] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartnerDetails = async () => {
      try {
        const response = await api.get(`${partnerId}/partnerdetail`);
        setPartner(response.data.partner);
        setUser(response.data.user);
        setRide(response.data.ride);

        setEnd([response.data.partner.pickup_longitude, response.data.partner.pickup_latitude]);
        setStart([response.data.ride.route.start_longitude, response.data.ride.route.start_latitude]);
      } catch (error) {
        console.error("Error fetching partner details:", error);
        setError("Failed to fetch partner details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerDetails();
  }, [partnerId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side: Partner Details */}
        <div className="w-1/2 p-6 bg-white overflow-y-auto border-r border-gray-300">
          <div className="border border-gray-300 rounded-lg shadow-md p-6 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Pickup Partner</h2>
            <div className="mb-2">
              <span className="font-medium text-gray-600">Username: </span>
              <span className="text-gray-800">{user?.username || 'N/A'}</span>
            </div>
            <div className="mb-2">
              <span className="font-medium text-gray-600">Name: </span>
              <span className="text-gray-800">
                {user?.first_name || 'N/A'} {partner?.user?.last_name || ''}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-medium text-gray-600">Phone Number: </span>
              <span className="text-gray-800">{user?.phone_number || 'N/A'}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-700 mt-4">Details</h3>
            <div className="mb-2">
              <span className="font-medium text-gray-600">Pickup Location: </span>
              <span className="text-gray-800">{partner?.pickup || 'N/A'}</span>
            </div>
            <div className="mb-2">
              <span className="font-medium text-gray-600">Dropoff Location: </span>
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
          </div>
        </div>

        {/* Right Side: Map with White Background */}
        <div className="w-1/2 bg-white p-6 flex items-center justify-center border-l border-gray-300">
          {start && end ? (
            <Navigation startlocation={start} endlocation={end} />
          ) : (
            <div>Loading map...</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPartnerDetails;
