import React, { useState, useEffect } from 'react';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useSelector } from 'react-redux';
import api from '../../../api'; // Ensure this is correctly configured for your API

const DeliverySearch = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [error, setError] = useState(null); // Add an error state
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchDeliveries = async () => {
      if (!user) {
        setError('User is not authenticated.');
        return; // Stop fetching if no user is available
      }

      try {
        const response = await api.get('deliverysearch/');

        // Check if the response contains data
        if (response.data && response.data.length > 0) {
          setDeliveries(response.data);
        } else {
          setError('No available deliveries.');
        }
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
    };

    fetchDeliveries(); // Fetch deliveries when user exists
  }, [user]);


  // const handleAccept = (deliveryId) => {
  //   const 
  //   console.log('Accepted delivery with ID:', deliveryId);
  // };

    const acceptdelivery = async (deliveryId) => {
      if (!user) {
        setError('User is not authenticated.');
        return; // Stop fetching if no user is available
      }

      try {
        const response = await api.post(`${deliveryId}/acceptdelivery/`);
        if (response.status === 200){
          navigate(`/courier_currlocation/${deliveryId}`);        }
      }catch (error){
        console.log('Error accepting delivery', error)
      }
    }







  return (

    <>
          <Navbar />

    <div className="flex flex-col min-h-screen">

      {/* Main content */}
      <main className="flex-grow container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">
          Available Deliveries
        </h1>

        {/* Error Handling */}
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Table for Deliveries */}
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="py-3 px-6 text-left">From</th>
              <th className="py-3 px-6 text-left">To</th>
              <th className="py-3 px-6 text-left">Package Size</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery) => (
              <tr key={delivery.id} className="border-b">
                <td className="py-3 px-6">{delivery.from_address.address_line_1}, {delivery.from_address.city}, {delivery.from_address.state}</td>
                <td className="py-3 px-6">{delivery.to_address.address_line_1}, {delivery.to_address.city}, {delivery.to_address.state}</td>
                <td className="py-3 px-6">{delivery.package_size}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => acceptdelivery(delivery.id)}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                  >
                    Accept
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      </div>
   
      <Footer />
    </>
  );
};

export default DeliverySearch;
