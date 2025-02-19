import React, { useEffect, useState } from "react";
import adminAxiosInstance from "../../adminaxiosconfig"; // Axios instance for admin API calls
import AdminNavbar from "../../components/AdminComponents/AdminNavbar";
import { NavLink } from "react-router-dom";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "../../component/ui/table";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../../component/ui/select";
import { Button } from "../../component/ui/button";
import { toast } from "sonner";

function RideManagement() {
  const [rides, setRides] = useState([]);
  const [statuses] = useState(["pending", "ongoing", "completed", "canceled"]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredRides, setFilteredRides] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const ridesPerPage = 6;

  const totalPages = Math.ceil(filteredRides.length / ridesPerPage);
  const startIndex = (currentPage - 1) * ridesPerPage;
  const currentRides = filteredRides.slice(startIndex, startIndex + ridesPerPage);

  // const fetchRides = async () => {
  //   try {
  //     const params = selectedStatus ? { filter: selectedStatus } : {};
  //     const response = await adminAxiosInstance.get("ridemanagement/rides/", { params });
  //     setRides(response.data.rides || []);
  //   } catch (error) {
  //     console.error("Error fetching rides:", error);
  //   }
  // };

  const fetchRides = async () => {
    try {
      const params = selectedStatus !== "all" ? { filter: selectedStatus } : {};
      const response = await adminAxiosInstance.get("ridemanagement/rides/", { params });
      setRides(response.data.rides || []);
      setFilteredRides(response.data.rides || [])
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
        // alert("Status updated successfully");
        toast.success("Status updated successfully")
        fetchRides();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      // alert("Failed to update status");
      toast.error("Failed to update status")
    }
  };


  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query)
    const filtered = rides.filter(
      (ride) =>
        ride.route.starting_point.toLowerCase().includes(query) ||
        ride.route.endpoint.toLowerCase().includes(query)
    );

    setFilteredRides(filtered);
  };


  useEffect(() => {
    fetchRides();
  }, [selectedStatus]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Ride Management</h1>
      <div className="flex items-center space-x-4 mb-6">
        <label htmlFor="status" className="text-lg font-medium">
          Filter by Status:
        </label>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
  <SelectTrigger className="w-40 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm">
    <span className="text-sm text-gray-700">
      {selectedStatus || "All"}
    </span>
  </SelectTrigger>
  <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg mt-1 z-50">
    <SelectItem value="all" className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700">
      All
    </SelectItem>
    {statuses.map((status) => (
      <SelectItem
        key={status}
        value={status}
        className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700"
      >
        {status}
      </SelectItem>
    ))}
  </SelectContent>
</Select>


      </div>

      <div className="mb-4">
          <input
            type="text"
            placeholder="Search by username, email, or name"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Route</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRides.map((ride) => (
              <TableRow key={ride.id}>
                <TableCell>{ride.date}</TableCell>
                <TableCell>{`${ride.route.starting_point} → ${ride.route.endpoint}`}</TableCell>
                <TableCell>{ride.status}</TableCell>
                <TableCell>
                  <Select
                    value={ride.status}
                    onValueChange={(newStatus) => handleStatusChange(ride.id, newStatus)}
                  >
                    <SelectTrigger  className="w-40 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm">
                    <span className="text-sm text-gray-700">
                      {ride.status}
                      </span>
                    </SelectTrigger>
                    <SelectContent  className="bg-white border border-gray-300 rounded-md shadow-lg mt-1 z-50">
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status} className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700">
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>



                </TableCell>
                <TableCell>
                  <NavLink to={`/ridedetail/${ride.id}`} className="text-blue-600 hover:underline">
                    View Details
                  </NavLink>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index}
              variant={currentPage === index + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default RideManagement;
