import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api"; // Replace with your API configuration file

function DeliveryDetails() {
  const { deliveryId } = useParams(); // Get the delivery ID from the URL
  const [delivery, setDelivery] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      try {
        const response = await api.get(`${deliveryId}/deliverydetail`); // Replace with your endpoint
        setDelivery(response.data); // Set the delivery data
      } catch (error) {
        console.error("Error fetching delivery details:", error);
        setError("Failed to fetch delivery details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryDetails();
  }, [deliveryId]);

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-orange-500 mb-12">Delivery Details</h2>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">From Address</h3>
              <p className="text-gray-600">{delivery.from_address.address_line_1}</p>
              <p className="text-gray-600">
                {delivery.from_address.city}, {delivery.from_address.state}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">To Address</h3>
              <p className="text-gray-600">{delivery.to_address.address_line_1}</p>
              <p className="text-gray-600">
                {delivery.to_address.city}, {delivery.to_address.state}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Package Details</h3>
            <p className="text-gray-600">
              <strong className="text-orange-500">Size:</strong> {delivery.package_size}
            </p>
            <p className="text-gray-600">
              <strong className="text-orange-500">Status:</strong> {delivery.status}
            </p>
            {delivery.courier && (
              <p className="text-gray-600">
                <strong className="text-orange-500">Courier:</strong> {delivery.courier.user.username}
              </p>
            )}
            {delivery.picked_up_at && (
              <p className="text-gray-600">
                <strong className="text-orange-500">Picked Up At:</strong> {new Date(delivery.picked_up_at).toLocaleString()}
              </p>
            )}
            {delivery.delivered_at && (
              <p className="text-gray-600">
                <strong className="text-orange-500">Delivered At:</strong> {new Date(delivery.delivered_at).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DeliveryDetails;
