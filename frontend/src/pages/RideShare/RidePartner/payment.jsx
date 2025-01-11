import React, { useState, useEffect } from "react";
import api from "../../../api";
import { PaymentButton } from "../../../components/payment/PaymentButton";
import { useNavigate, useParams } from "react-router-dom";

const PaymentPage = () => {
  const { partnerId } = useParams();
  const [ridePartner, setRidePartner] = useState(null);
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate()
  const amount = 100

  useEffect(() => {
    // Fetch ride partner details
    const fetchRidePartner = async () => {
      try {
        const response = await api.get(`partner/${partnerId}/ridedetail/`);
        setRidePartner(response.data.partner);
        setRide(response.data.ride);
        console.log(response.data)
      } catch (err) {
        setError("Failed to load ride details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRidePartner();
  }, [partnerId]);



  const handleSuccess = async (response) => {
    try {
      // Complete delivery and transfer to courier
      navigate(`/partner/ridedetail/${ride.id}`)

      // await paymentApi.completeDelivery(delivery.id);
      // Update UI or navigate
    } catch (error) {
      console.error('Failed to complete delivery payment:', error);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Payment for Ride</h1>

      <h2>Ride Details</h2>
      <p>
        <strong>Starting Point:</strong> {ride.route.starting_point}
      </p>
      <p>
        <strong>Endpoint:</strong> {ride.route.endpoint}
      </p>
      <p>
        <strong>Vehicle:</strong> {ride.vehicle}
      </p>
      <p>
        <strong>Date:</strong> {ride.date}
      </p>
      <p>
        <strong>Status:</strong> {ride.status}
      </p>

      <h2>Partner Details</h2>
      <p>
        <strong>Pickup:</strong> {ridePartner?.pickup}
      </p>
      <p>
        <strong>Dropoff:</strong> {ridePartner?.dropoff}
      </p>
      <p>
        <strong>Seats Reserved:</strong> {ridePartner?.seats}
      </p>





      <section className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Payment Details</h2>
            <div className="text-gray-700 mb-4">
              <p>
                <strong>Total Amount:</strong> ₹{ridePartner?.amount}
              </p>
              <p>Click the button below to proceed with the payment.</p>
            </div>

      <PaymentButton
        amount={ridePartner.amount}
        providerId={ride.user.id}
        serviceType="ride"
        serviceId={ridePartner.id}
        onSuccess={handleSuccess}
        onError={(error) => console.error('Payment failed:', error)}
      />
 

 </section>
    </div>
  );
};

export default PaymentPage;
