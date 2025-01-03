import React, { useState } from 'react';
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


function MyJoinlist({ joins }) {
    const [currentPage, setCurrentPage] = useState(1);
    const joinsPerPage = 6; // Number of deliveries per page
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Calculate total pages
    const totalPages = Math.ceil(joins.length /joinsPerPage);

    // Get the current page's deliveries
    const startIndex = (currentPage - 1) * joinsPerPage;
    const currentjoins = joins.slice(startIndex, startIndex + joinsPerPage);

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };




    const handleViewDetails = (rideId) => {
        console.log(`Navigating to ride details for ride ID: ${rideId}`);
      
        
        navigate(`/partner/ridedetail/${rideId}`)
    };

    return (
        <div className="flex flex-col items-center justify-center">
            {/* Responsive Table Container */}
            <div className="w-full max-w-6xl px-4 overflow-x-auto">

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
                        {currentjoins.map((ride, index) => (

                            <TableRow key={ride.id}>
                                <TableCell className=" p-4 font-medium">{startIndex + index + 1}</TableCell>
                                <TableCell className="p-4">{ride.pickup}, </TableCell>
                                <TableCell className="p-4">{ride.dropoff}</TableCell>
                                <TableCell className="p-4">{ride.seats}</TableCell>
                                <TableCell className="p-4">{ride.status}</TableCell>



                                <TableCell className="">
                                        <span
                                            className="text-blue-500 hover:underline cursor-pointer"
                                            onClick={() => handleViewDetails(ride.ride)}
                                        >
                                            View Details
                                        </span>
                                    </TableCell>;
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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

export default MyJoinlist;
