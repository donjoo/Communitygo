import React, { useEffect } from 'react'
import { useState } from 'react'


import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react'
import adminAxiosInstance from '../../adminaxiosconfig'
import { useSelector } from 'react-redux'
import AdminNavbar from '../../components/AdminComponents/AdminNavbar'
import { NavLink } from 'react-router-dom'



  
function DeliveryManagement() {

    const [deliveries, setDeliveries] = useState([]);
    const [error,setError]    = useState(null);
    const user = useSelector((state) => state.auth.user);
    const [statuses] = useState([
        "PENDING",
        "ASSIGNED",
        "PICKED_UP",
        "DELIVERED",
        "CANCELED",
      ]);

    const [currentPage,setCurrentPage] = useState(1);
    const deliveriesPerPage = 6;

    const totalPages = Math.ceil(deliveries.length / deliveriesPerPage);
    
    const startIndex = (currentPage - 1) * deliveriesPerPage;
    const currentDeliveries = deliveries.slice(startIndex,startIndex + deliveriesPerPage);


    const handlePageChange = (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    };




    const fetchDeliveries = async () => {
        try {
            const response = await adminAxiosInstance.get('deliverylist/');

            if (response.data){
                setDeliveries(response.data.deliveries); 
            } else {
                setError('No data found.');
            }
        }catch (error){
            console.error('Error fetching userlist')
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
            fetchDeliveries(); // Refresh the list
          }
        } catch (error) {
          console.error("Error updating status", error);
          alert("Failed to update status");
        }
      };
    useEffect(() => {
        fetchDeliveries()
    },[])



  return (
   <>
   < AdminNavbar />
    <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Delivery Management</h1>
    
   

    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">created at</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>

          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentDeliveries.map((delivery) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">{delivery.created_at}</td>
              <td className="px-6 py-4 whitespace-nowrap">{delivery.from_address.address_line_1}</td>
              <td className="px-6 py-4 whitespace-nowrap">{delivery.to_address.address_line_1}</td>
              <td className="px-6 py-4 whitespace-nowrap">{delivery.status}</td>
              <td className="px-6 py-4">
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
                  </td>
                  <td> <NavLink to={`/admindeliverydetail/${delivery.id}`} className="text-blue-500 hover:underline">
                View Details
              </NavLink></td>
            </tr>
          ))}
        </tbody>

      </table>

      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 border rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-white'}`}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 border rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-white'}`}
        >
          Next
        </button>
      </div>
    </div>

   
  
  </div>
  </>
  )
}

export default DeliveryManagement







