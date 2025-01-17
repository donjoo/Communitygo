import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api"; // Replace with your API configuration file
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import MapComponent from "../../../components/map/MapComponent";
import RatingCard from "../../../components/common/Rating";
import ChatRoom from "../../Chat/ChatRoom";
import { Button } from "../../../component/ui/button";

function DeliveryDetails() {
  const { deliveryId } = useParams(); // Get the delivery ID from the URL
  const [delivery, setDelivery] = useState(null);
  const [courier, setCourier] = useState(null);
  const [courier_user, setCourier_user] = useState(null)
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [change,setChange] = useState(null);
  const navigate = useNavigate();

  const baseURL = "http://localhost:8000"; // Replace with your actual base URL if different

  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      try {
        const response = await api.get(`${deliveryId}/deliverydetail`); // Replace with your endpoint
        setDelivery(response.data.delivery);
        setCourier(response.data.courier); // Set the delivery data
        setCourier_user(response.data.courier_user)
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching delivery details:", error);
        setError("Failed to fetch delivery details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryDetails();
  }, [deliveryId,change]);


  const handleRatingSubmit = async (rating,feedback) => {
    try {
     const response =  await api.post(`${courier.id}/ratecourier/`, { rating,feedback });
     if (response.status === 200) {
            alert("Rating submitted successfully!");
            setCourier((prevCourier) => ({
              ...prevCourier,
              rating: rating,
            }));
            setChange('rating')
          } else {
            alert("Failed to submit rating. Please try again.");
          }
     
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };


  const handleCancle = async() => {
      try {
        const response = await api.post(`delivery/${deliveryId}/cancel`);
        setChange('cancled')
      } catch (error){
        alert("Failed to cancel")
      }

  }

  const CompletePayment = () => {
    navigate(`/delivery/payment/${deliveryId}`);
  }




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

    <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-700 mb-6">Delivery Details</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-600 mb-4">From Address</h2>
              <p>{delivery.from_address.address_line_1}</p>
              <p>{delivery.from_address.city}, {delivery.from_address.state}</p>

              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-600 mb-4">Package Details</h2>
                <p><strong>Size:</strong> {delivery.package_size}</p>
                <p><strong>Dimensions:</strong> {delivery.length}cm (L) x {delivery.width}cm (W) x {delivery.height}cm (H)</p>
                <p><strong>Weight:</strong> {delivery.weight}kg</p>
                <p><strong>Status:</strong> {delivery.status}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-600 mb-4">To Address</h2>
              <p>{delivery.to_address.address_line_1}</p>
              <p>{delivery.to_address.city}, {delivery.to_address.state}</p>

              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-600 mb-4">Courier Details</h2>
                {courier ? (
                  <div>
                    <p><strong>Courier:</strong> {courier_user?.username}</p>
                    <p><strong>Phone Number:</strong> {courier_user?.phone_number}</p>
                    {delivery.status === 'ASSIGNED' && (
                      <div className="mt-4 p-4 bg-yellow-100 rounded-md">
                        <p className="font-semibold">Share OTP when courier has reached you for pickup</p>
                        <p><strong>Pickup OTP:</strong> {delivery.pickup_otp}</p>
                      </div>
                    )}
                    {delivery.status === 'PICKED_UP' && (
                      <div className="mt-4 p-4 bg-green-100 rounded-md">
                        <p className="font-semibold">Share OTP with the person who is getting the package or with the courier for dropoff</p>
                        <p><strong>Dropoff OTP:</strong> {delivery.dropoff_otp}</p>
                      </div>
                    )}
                  </div>
                ) : (
                   <div>
                {!delivery.payment_done && delivery.status !== 'Canceled' ? (
                  <div>
                    <p className="text-red-600 font-semibold">
                      Complete payment to assign a courier
                    </p>
                    <Button onClick={CompletePayment}>Complete Payment</Button>
                  </div>
                ) : delivery.payment_done && delivery.status === 'Canceled' ? (
                  <p className="text-gray-500 font-semibold">No courier was assigned</p>
                ) : delivery.payment_done ? (
                  <p className="text-orange-500">
                    Waiting for a courier to accept your delivery request.
                  </p>
                ) : delivery.status === 'Canceled' ? (
                  <p className="text-gray-500 font-semibold">No courier was assigned</p>
                ) : (
                  <p className="text-red-600 font-semibold">Complete payment to assign courier</p>
                )}
              </div>
                )
              
              
              }
                {delivery.picked_upat && (
                  <p className="mt-4"><strong>Picked Up At:</strong> {formatDate(delivery.picked_upat)}</p>
                )}
                {delivery.delivered_at && (
                  <p><strong>Delivered At:</strong> {formatDate(delivery.delivered_at)}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end">
              <h2 className="text-lg font-semibold text-gray-600 mb-4">
                Status: <span className="text-blue-600">{delivery.status}</span>
              </h2>
              {(!courier?.rating && delivery.status === 'DELIVERED') && (
                <div className="w-full">
                  <RatingCard courierId={courier?.id} onSubmit={handleRatingSubmit} />
                </div>
              )}
              {delivery.image && (
                <img src={`${baseURL}${delivery.image}`} alt={delivery.description} className="w-full max-w-xs h-auto object-cover mt-4 rounded-md shadow-md" />
              )}

      <div className=" mt-5">
      {delivery.status === 'PENDING' || delivery.status === 'PAYMENT' ? (
                <Button onClick={handleCancle} >Cancel request</Button>
              ):null}
     </div>


     <div className=" mt-5">
              {!delivery.payment_done && delivery.status !== 'Canceled' ? (
                <div>
                < p className="md-3 font-semibold text-lg text-red-600">payment not done:</p>
                <Button onClick={CompletePayment} >Complete payment</Button>
                </div>
              ):null}
     </div>
            </div>
          </div>
        </section>
      </div>
    </main>
    <Footer />
    
    <Button
      className="fixed bottom-4 right-4 z-50"
      onClick={() => setShowChat(!showChat)}
    >
      {showChat ? 'Close Chat' : 'Open Chat'}
    </Button>

    {showChat && (
      <div className="fixed bottom-16 right-4 z-50 w-96 h-[calc(100vh-6rem)] max-h-[32rem] bg-white shadow-lg rounded-lg overflow-hidden">
        <ChatRoom receiverUsername={courier_user?.username} />
      </div>
    )}
  </div>
  );
}

export default DeliveryDetails;
