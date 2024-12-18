import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api"; // Replace with your API configuration file
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { FaStar } from "react-icons/fa"; // For star icons

function CourierDetails() {
  const { deliveryId } = useParams(); // Get the delivery ID from the URL
  const [delivery, setDelivery] = useState(null);
  const [courier, setCourier] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user,setUser] = useState(null);
  const navigate = useNavigate()


  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      try {
        const response = await api.get(`${deliveryId}/courierdetails`); // Replace with your endpoint
        console.log(response.data)
        setDelivery(response.data.delivery);
        setUser(response.data.user)
        setCourier(response.data.courier); // Set the courier data
        console.log(response.data);
      
      } catch (error) {
        console.error("Error fetching delivery details:", error);
        setError("Failed to fetch delivery details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryDetails();
  }, [deliveryId]);





  // Show loading state
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  // Show error message if there is an error
  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  // Format date helper function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? "Invalid Date" : date.toLocaleString();
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="bg-gray-50 font-sans leading-tight tracking-tight">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between gap-3">
              {/* Right Section: Delivery Details (Equal Height) */}
              <div className="w-full md:w-1/3 min-h-[400px] space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-lg h-full">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Details</h2>
                  <div className="grid gap-3">
                    <div>
                      <p className="text-lg text-gray-600"><strong>Name:</strong> {user.username}</p>
                      <p className="text-lg text-gray-600"><strong>Phone:</strong> {user.phone_number}</p>
                    </div>
                    <div>
                      <p className="text-lg text-gray-600"><strong>Package Size:</strong> {delivery?.package_size}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-lg text-gray-600"><strong>Status:</strong> {delivery?.status}</p>
                    <p className="text-lg text-gray-600"><strong>Delivery Time:</strong> {formatDate(delivery?.delivered_at)}</p>
                  </div>
                  
                  {courier?.rating != null ? (
                    <p className="text-yellow-500 flex items-center">
                      <span className="mr-2">Rating:</span>
                      {courier.rating}
                      {/* Display stars based on the rating */}
                      <span className="flex ml-2">
                        {Array.from({ length: Math.round(courier.rating) }, (_, index) => (
                          <FaStar key={index} className="text-yellow-500" />
                        ))}
                      </span>
                    </p>
                  ) : (
                    <p className="text-gray-600">No rating available</p>
                  )}
                </div>
              </div>

              {/* Left Section: Pickup and Dropoff Addresses (Adjusted Size) */}
              <div className="w-full md:w-2/3 space-y-4">
                  {/* Pickup Address Card */}
                  <div className="bg-green-100 p-6 rounded-lg shadow-lg min-h-[220px] relative">
                    <h1 className="text-xl font-semibold text-gray-800 mb-3">Pickup Address</h1>
                    <p className="text-lg text-gray-600">{delivery?.from_address?.address_line_1}</p>
                    <p className="text-lg text-gray-600 mt-2">
                      {delivery?.from_address?.city}, {delivery?.from_address?.state}
                    </p>
                    <p className="text-lg text-gray-600 mt-2"><strong>Pickup Time:</strong> {formatDate(delivery?.picked_upat)}</p>

                    {/* Styled Button */}
                    {delivery.is_pickedup ? (<div  className="absolute bottom-4 right-4">Pickup Completed</div>) : (
                    <button onClick={()=>navigate(`/pickuplocation/${deliveryId}`)}    className="absolute bottom-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-orange-600 focus:outline-none">
                      Pickup location
                    </button>
                    )}
                  </div>


                {/* Dropoff Address Card */}
                <div className="bg-yellow-100 p-6 rounded-lg shadow-lg min-h-[220px] relative">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">Dropoff Address</h2>
                  <p className="text-lg text-gray-600">{delivery?.to_address?.address_line_1}</p>
                  <p className="text-lg text-gray-600 mt-2">
                    {delivery?.to_address?.city}, {delivery?.to_address?.state}
                  </p>


                  {delivery.is_completed ? (<div  className="absolute bottom-4 right-4">Delivery Completed</div>) : (
                  <button  onClick={()=>navigate(`/dropofflocation/${deliveryId}`)}  className="absolute bottom-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-orange-600 focus:outline-none">
                    Dropoff location
                  </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default CourierDetails;
