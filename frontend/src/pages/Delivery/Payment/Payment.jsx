import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api"; // Replace with your API configuration file
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { PaymentButton } from "../../../components/payment/PaymentButton";
import { paymentApi } from "../../../services/payment_api";


function DeliveryPayment() {
  const { deliveryId } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDeliveryDetails = async () => {
    try {
      const response = await api.get(`${deliveryId}/deliverydetail`);
      setDelivery(response.data.delivery);
    } catch (err) {
      console.error("Error fetching delivery details:", err);
      setError("Failed to fetch delivery details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryDetails();
  }, [deliveryId]);

 

  const handleSuccess = async (response) => {
    try {
      // Complete delivery and transfer to courier
      await paymentApi.completeDelivery(delivery.id);
      // Update UI or navigate
    } catch (error) {
      console.error('Failed to complete delivery payment:', error);
    }
  }


  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow overflow-auto bg-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Delivery Payment</h1>

          {/* Delivery Details */}
          <section className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Delivery Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* From Address */}
              <div>
                <h3 className="text-lg font-semibold text-gray-600">From Address</h3>
                <p className="text-gray-700">{delivery.from_address.address_line_1}</p>
                <p className="text-gray-700">
                  {delivery.from_address.city}, {delivery.from_address.state}
                </p>
              </div>

              {/* To Address */}
              <div>
                <h3 className="text-lg font-semibold text-gray-600">To Address</h3>
                <p className="text-gray-700">{delivery.to_address.address_line_1}</p>
                <p className="text-gray-700">
                  {delivery.to_address.city}, {delivery.to_address.state}
                </p>
              </div>

              {/* Package Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-600">Package Details</h3>
                <p className="text-gray-700">
                  <strong>Size:</strong> {delivery.package_size}
                </p>
                <p className="text-gray-700">
                  <strong>Weight:</strong> {delivery.weight} kg
                </p>
                <p className="text-gray-700">
                  <strong>Dimensions:</strong> {delivery.length}cm (L) x {delivery.width}cm (W) x {delivery.height}cm (H)
                </p>
              </div>

              {/* Delivery Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-600">Delivery Status</h3>
                <p className="text-blue-600 font-medium">{delivery.status}</p>
              </div>
            </div>
          </section>

          {/* Payment Section */}
          <section className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Payment Details</h2>
            <div className="text-gray-700 mb-4">
              <p>
                <strong>Total Amount:</strong> ₹{delivery.amount}
              </p>
              <p>Click the button below to proceed with the payment.</p>
            </div>
            <PaymentButton
        amount={delivery.amount}
        providerId={delivery.courier_id}
        serviceType="delivery"
        serviceId={delivery.id}
        onSuccess={handleSuccess}
        onError={(error) => console.error('Payment failed:', error)}
      />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default DeliveryPayment;
