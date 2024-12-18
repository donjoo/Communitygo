import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api"; // Replace with your API configuration file
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import MapComponent from "../../../components/map/MapComponent";
import RatingCard from "../../../components/common/Rating";

function DeliveryDetails() {
  const { deliveryId } = useParams(); // Get the delivery ID from the URL
  const [delivery, setDelivery] = useState(null);
  const [courier, setCourier] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      try {
        const response = await api.get(`${deliveryId}/deliverydetail`); // Replace with your endpoint
        setDelivery(response.data.delivery);
        setCourier(response.data.courier); // Set the delivery data
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


  const handleRatingSubmit = async (rating) => {
    try {
     const response =  await api.post(`/rating/${courier.id}`, { rating });
     if (response.status === 200) {
            alert("Rating submitted successfully!");
            setCourier((prevCourier) => ({
              ...prevCourier,
              rating: rating,
            }));
          } else {
            alert("Failed to submit rating. Please try again.");
          }
     
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

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
        <main className="container mx-auto py-8">
          <section className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-700 mb-4">Delivery Details</h1>

            {/* Delivery Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* From Address */}

              <div>



              <div>
                <h2 className="text-lg font-semibold text-gray-600">From Address</h2>
                <p>{delivery.from_address.address_line_1}</p>
                <p>
                  {delivery.from_address.city}, {delivery.from_address.state}
                </p>
              </div>

                 <div className="mt-10">
                <h2 className="text-lg font-semibold text-gray-600">Package Details</h2>
                <p>
                  <strong>Size:</strong> {delivery.package_size}
                </p>
                <p>
                  <strong>Status:</strong> {delivery.status}
                </p>
              </div>


              </div>

              <div>
              <div>
                <h2 className="text-lg font-semibold text-gray-600">To Address</h2>
                <p>{delivery.to_address.address_line_1}</p>
                <p>
                  {delivery.to_address.city}, {delivery.to_address.state}
                </p>
              </div>



              <div className="mt-10">
                <h2 className="text-lg font-semibold text-gray-600">Courier Details</h2>
                {courier ? (
                  <div>
                  <div>
                    <p><strong>Courier:</strong> {courier?.username}</p>
                    <p><strong>Phone Number:</strong> {courier?.phone_number}</p>
                  </div>
                  {delivery.status === 'ASSIGNED' && (

                    <div>
                      <p>share otp when courier has reached you for pickup</p>
                      <p>
                      <strong>pickupotp:</strong> {delivery.pickup_otp}
                      </p>
                    </div>
                  
                  )}

                    {delivery.status === 'PICKED_UP' && (

                    <div>
                      <p>share otp with the person who is getting the pacakage or with the courier you for dropoff</p>
                      <p>
                      <strong>Dropoffotp:</strong> {delivery.dropoff_otp}
                      </p>
                    </div>

                    )}


                  
                  </div>
                ):(
                  <p><span className="text-orange-500">waiting for a courier to accept your delivery request.</span></p>
                )}

                {delivery.picked_upat && (
                  <p><strong>Picked Up At:</strong> {formatDate(delivery.picked_upat)}</p>
                )}

                {delivery.delivered_at && (
                  <p><strong>Delivered At:</strong> {formatDate(delivery.delivered_at)}</p>
                )}
              </div>


              </div>

              {/* Status (Aligned to top-right) */}
              <div className="flex justify-end">
                <h2 className="text-lg font-semibold text-gray-600">
                  Status: <span>{delivery.status}</span>
                </h2>

                {(!courier?.rating && delivery.status === 'DELIVERED') ? (
                  <RatingCard courierId={courier?.id} onSubmit={handleRatingSubmit} /> // Display RatingCard when no rating is given and delivery status is 'DELIVERED'
                    ) : ('')}
                </div>
            </div>

          
          </section>
          <div className="mt-30">
</div>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default DeliveryDetails;
