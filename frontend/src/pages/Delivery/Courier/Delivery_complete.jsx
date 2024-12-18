import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api";

const CourierCompleted = () => {

    const {deliveryId} = useParams();
    const [delivery,setDelivery] = useState(null)
    const [user,setUser] = useState(null)
    const navigate = useNavigate()


        
    useEffect(() => {
        const DeliveryDetails = async () => {
            try {
                const response = await api.get(`${deliveryId}/deliverydetail`);
                setDelivery(response.data.delivery);
                setUser(response.data.user)
            } catch (error) {
                console.log("Error fetching deivery details:".error);
            } 
        }

        DeliveryDetails();
    },[deliveryId])


    useEffect(() =>{
        console.log(delivery)
    },[delivery])
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="mt- flex flex-1 overflow-hidden">
        {/* Right Side: Details */}
        <div className="flex-1 p-6 bg-white overflow-y-auto">
          <div className="border border-gray-300 rounded-lg shadow-md p-6 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Delivery Completed</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Pickup Details Column */}
              <div>
                <h3 className="text-lg font-bold text-gray-700 mt-4">Pickup Details</h3>
                
                <div className="mb-2">
                  <span className="font-medium text-gray-600">Address Line 1: </span>
                  <span className="text-gray-800">{delivery?.from_address?.address_line_1 || 'N/A'}</span>
                </div>
                <div className="mb-2">
                  <span className="font-medium text-gray-600">City: </span>
                  <span className="text-gray-800">{delivery?.from_address?.city || 'N/A'}</span>
                </div>
                <div className="mb-2">
                  <span className="font-medium text-gray-600">State: </span>
                  <span className="text-gray-800">{delivery?.from_address?.state || 'N/A'}</span>
                </div>
                <div className="mb-2">
                  <span className="font-medium text-gray-600">Country: </span>
                  <span className="text-gray-800">{delivery?.from_address?.country || 'N/A'}</span>
                </div>
                <div className="mb-2">
                  <span className="font-medium text-gray-600">Postal Code: </span>
                  <span className="text-gray-800">{delivery?.from_address?.postal_code || 'N/A'}</span>
                </div>
              </div>

              {/* Dropoff Details Column */}
              <div>
                <h3 className="text-lg font-bold text-gray-700 mt-4">Dropoff Details</h3>
                
                <div className="mb-2">
                  <span className="font-medium text-gray-600">Address Line 1: </span>
                  <span className="text-gray-800">{delivery?.to_address?.address_line_1 || 'N/A'}</span>
                </div>
                <div className="mb-2">
                  <span className="font-medium text-gray-600">City: </span>
                  <span className="text-gray-800">{delivery?.to_address?.city || 'N/A'}</span>
                </div>
                <div className="mb-2">
                  <span className="font-medium text-gray-600">State: </span>
                  <span className="text-gray-800">{delivery?.to_address?.state || 'N/A'}</span>
                </div>
                <div className="mb-2">
                  <span className="font-medium text-gray-600">Country: </span>
                  <span className="text-gray-800">{delivery?.to_address?.country || 'N/A'}</span>
                </div>
                <div className="mb-2">
                  <span className="font-medium text-gray-600">Postal Code: </span>
                  <span className="text-gray-800">{delivery?.to_address?.postal_code || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Status and Package Size */}
            <div className="mt-4">
              <div className="mb-2">
                <span className="font-medium text-gray-600">Status: </span>
                <span className="text-gray-800">{delivery?.status}</span>
              </div>
              <div className="mb-2">
                <span className="font-medium text-gray-600">Package Size: </span>
                <span className="text-gray-800">{delivery?.package_size}</span>
              </div>
            </div>

            {/* Completion Details */}
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-700">Delivery Completed</h3>
              <p className="text-gray-800 mt-2">The delivery has been successfully completed!</p>
            </div>

            {/* Action Button */}
            <div className="mt-6">
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Continue to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourierCompleted;
