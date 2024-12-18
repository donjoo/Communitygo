import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useSelector } from 'react-redux';
import api from '../../api'; // Ensure this is correctly configured for your API

const DeliveryList = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [error, setError] = useState(null); // Add an error state
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchDeliveries = async () => {
     
      try {
        const response = await api.get('deliverylist/', {
          params: { user: user.id }, // Pass user ID if available
        });

        // Check if the response contains data
        if (response.data) {
          setDeliveries(response.data);
        } else {
          setError('No deliveries found.');
        }
      } catch (error) {
        console.error('Error fetching deliveries:', error);
        // setError('Failed to fetch deliveries.');
      }
    };

    fetchDeliveries(); // Only fetch if user exists and is authenticated
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Main content */}
      <main className="flex-grow container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">
          Requested Deliveries
        </h1>
        
        {/* Error Handling */}
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="bg-white border rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-orange-500 mb-4">
                Delivery ID: {delivery.id}
              </h2>
              <p className="text-gray-600">
                <strong>From:</strong> {delivery.from_address.address_line_1}, {delivery.from_address.city}, {delivery.from_address.state}
              </p>
              <p className="text-gray-600">
                <strong>To:</strong> {delivery.to_address.address_line_1}, {delivery.to_address.city}, {delivery.to_address.state}
              </p>
              <p className="text-gray-600">
                <strong>Package Size:</strong> {delivery.package_size}
              </p>
              <p className="text-gray-600">
                <strong>Status:</strong> {delivery.status}
              </p>
              <p className="text-gray-600">
                <strong>Details:</strong> {delivery.details}
              </p>
              <div className="mt-4">
                <NavLink
                  to={`/deliveries/${delivery.id}`}
                  className="text-blue-500 hover:underline"
                >
                  View Details
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DeliveryList;
