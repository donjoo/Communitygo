import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api";
import AdminNavbar from "../../components/AdminComponents/AdminNavbar";
import adminAxiosInstance from "../../adminaxiosconfig";

function AdminDeliveryDetails() {
  const { deliveryId } = useParams(); // Get the delivery ID from the URL
  const [delivery, setDelivery] = useState(null);
  const [courier, setCourier] = useState(null);
  const [user,setUser] = useState(null)
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [statuses] = useState([
    "PENDING",
    "ASSIGNED",
    "PICKED_UP",
    "DELIVERED",
    "CANCELED",
  ]);

    const fetchDeliveryDetails = async () => {
      try {
        const response = await adminAxiosInstance.get(`${deliveryId}/deliverydetail`); // Replace with your endpoint
        setDelivery(response.data.delivery);
        setCourier(response.data.courier); // Set the delivery data
        setUser(response.data.user)
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching delivery details:", error);
        setError("Failed to fetch delivery details.");
      } finally {
        setLoading(false);
      }
    };

  


  const handleStatusChange = async (deliveryId, newStatus) => {
    try {
      const response = await adminAxiosInstance.patch(
        `delivery/${deliveryId}/update-status/`,
        { status: newStatus }
      );
      if (response.status === 200) {
        alert("Status updated successfully");
        fetchDeliveryDetails(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating status", error);
      alert("Failed to update status");
    }
  };
useEffect(() => {
    fetchDeliveryDetails()
},[])

useEffect(() => {
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
        <AdminNavbar />
        <main className="container mx-auto py-8">
          <section className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-700 mb-4">Delivery Details</h1>

            {/* Delivery Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* From Address */}

              <div>
                <div onClick={() => navigate(`/user/${user.id}`)} className="cursor-pointer">                
                    <h3>User</h3>
              <p>{user.first_name} {user.last_name}</p>
              <p>{user.phone_number}</p>
              </div>

                <p>
                  {delivery.from_address.city}, {delivery.from_address.state}
                </p>


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

                    <p onClick={() => navigate(`/user/${delivery.courier}`)}><strong>Courier:</strong> {courier.user}</p>
                  </div>
                 

                  
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
                <select
                      className="p-2 border rounded"
                      value={delivery.status}
                      onChange={(e) =>
                        handleStatusChange(delivery.id, e.target.value)
                      }
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
               
                </div>
            </div>

          
          </section>
          <div className="mt-30">
</div>
        </main>

      </div>
    </>
  );
}

export default AdminDeliveryDetails;
