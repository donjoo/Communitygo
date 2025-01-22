import React, { useEffect, useState } from "react";
import adminAxiosInstance from "../../adminaxiosconfig"; // Axios instance for admin API calls
import AdminNavbar from "../../components/AdminComponents/AdminNavbar";
import { NavLink } from "react-router-dom";

function RideManagement() {
  const [rides, setRides] = useState([]);
  const [statuses] = useState(["pending", "ongoing", "completed", "canceled"]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ridesPerPage = 6;

  const totalPages = Math.ceil(rides.length / ridesPerPage);
  const startIndex = (currentPage - 1) * ridesPerPage;
  const currentRides = rides.slice(startIndex, startIndex + ridesPerPage);

  const fetchRides = async () => {
    try {
      const params = selectedStatus ? { filter: selectedStatus } : {};
      const response = await adminAxiosInstance.get("ridemanagement/rides/", { params });
      setRides(response.data.rides || []);
    } catch (error) {
      console.error("Error fetching rides:", error);
    }
  };

  const handleStatusChange = async (rideId, newStatus) => {
    try {
      const response = await adminAxiosInstance.patch(`ride/${rideId}/update-status/`, {
        status: newStatus,
      });
      if (response.status === 200) {
        alert("Status updated successfully");
        fetchRides();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    fetchRides();
  }, [selectedStatus]);

  return (
    <>
      <AdminNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Ride Management</h1>
        <div className="flex items-center space-x-2 mb-6">
          <label htmlFor="status">Filter by Status:</label>
          <select
            id="status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border rounded-md text-lg"
          >
            <option value="">All</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Route</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
                <th className="px-6 py-3 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {currentRides.map((ride) => (
                <tr key={ride.id}>
                  <td className="px-6 py-4">{ride.date}</td>
                  <td className="px-6 py-4">{`${ride.route.starting_point} → ${ride.route.endpoint}`}</td>
                  <td className="px-6 py-4">{ride.status}</td>
                  <td className="px-6 py-4">
                    <select
                      value={ride.status}
                      onChange={(e) => handleStatusChange(ride.id, e.target.value)}
                      className="p-2 border rounded"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <NavLink
                      to={`/adminridedetail/${ride.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      View Details
                    </NavLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 border rounded ${
                currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-white"
              }`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 border rounded ${
                  currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 border rounded ${
                currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-white"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default RideManagement;
