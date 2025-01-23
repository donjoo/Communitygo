import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../component/ui/table"
import { useDispatch } from 'react-redux';
import { setRideData } from '../../../redux/ride/rideslice';


function AdminRideJoinedlist({ joinedRides }) {
    const [filteredRides, setFilteredRides] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ridesPerPage = 5; // Number of deliveries per page
    const dispatch = useDispatch();
    const navigate = useNavigate();


    useEffect(() => {
        setFilteredRides(joinedRides)
    },[])
    // Calculate total pages
    const totalPages = Math.ceil(filteredRides.length / ridesPerPage);

    // Get the current page's deliveries
    const startIndex = (currentPage - 1) * ridesPerPage;
    const currentrides = filteredRides.slice(startIndex, startIndex + ridesPerPage);
    console.log(joinedRides)
    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };


    const handleViewDetails = (rideId) => {
        console.log(`Navigating to ride details for ride ID: ${rideId}`);
        const ridedata = {
            'id':rideId,
        }
        navigate(`/ridedetail/${rideId}`);
   
    };


    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query)
        const filtered = joinedRides.filter(
          (ride) =>
            ride.pickup.toLowerCase().includes(query) ||
            ride.dropoff.toLowerCase().includes(query) ||
            ride.status.toLowerCase().includes(query) 
        );
    
        setFilteredRides(filtered);
      };

    return (
        <div className="flex flex-col items-center justify-center">
            {/* Responsive Table Container */}
            <div className="w-full max-w-6xl px-4 overflow-x-auto">
            <div className="mb-4">
          <input
            type="text"
            placeholder="Search by username, email, or name"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

                <Table className="table-auto border border-gray-200 shadow-lg">

                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px] p-4 text-left">-</TableHead>
                            <TableHead className="w-[150px] p-4 text-left">From</TableHead>
                            <TableHead className="w-[150px] p-4 text-left">To</TableHead>
                            <TableHead className="w-[150px] p-4 text-left">seat shared</TableHead>
                            <TableHead className="w-[150px] p-4 text-left">Status</TableHead>
                            <TableHead className=" w-[150px] p-4 text-left">Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentrides.map((ride, index) => (

                            <TableRow key={ride.id}>
                                <TableCell className=" p-4 font-medium">{startIndex + index + 1}</TableCell>
                                <TableCell className="p-4">{ride.pickup}, </TableCell>
                                <TableCell className="p-4">{ride.dropoff}</TableCell>
                                <TableCell className="p-4">{ride.seats}</TableCell>
                                <TableCell className="p-4">{ride.status}</TableCell>



                                <TableCell className="">
                                        <span
                                            className="text-blue-500 hover:underline cursor-pointer"
                                            onClick={() => handleViewDetails(ride.id)}
                                        >
                                            View Details
                                        </span>
                                    </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>








                {/* 
      // <div key={delivery.id} className="bg-white border rounded-lg shadow-lg p-6">
      //       <h2 className="text-xl font-semibold text-orange-500 mb-4">
      //         Delivery ID: {delivery.id}
      //       </h2>
      //       <p className="text-gray-600">
      //         <strong>From:</strong> {delivery.from_address.address_line_1}, {delivery.from_address.city}, {delivery.from_address.state}
      //       </p>
      //       <p className="text-gray-600">
      //         <strong>To:</strong> {delivery.to_address.address_line_1}, {delivery.to_address.city}, {delivery.to_address.state}
      //       </p>
      //       <p className="text-gray-600">
      //         <strong>Package Size:</strong> {delivery.package_size}
      //       </p>
      //       <p className="text-gray-600">
      //         <strong>Status:</strong> {delivery.status}
      //       </p>
      //       <p className="text-gray-600">
      //         <strong>Details:</strong> {delivery.details}
      //       </p>
      //       <div className="mt-4">
      //         <NavLink to={`/deliverydetail/${delivery.id}`} className="text-blue-500 hover:underline">
      //           View Details
      //         </NavLink>
      //       </div>
      //     </div> */}

            </div>

            {/* Pagination Controls */}
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
    );
}

export default AdminRideJoinedlist;
