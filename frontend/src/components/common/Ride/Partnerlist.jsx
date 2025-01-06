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
import { useDispatch, useSelector } from 'react-redux';
import { setRideData } from '../../../redux/ride/rideslice';


function Partnerlist({ partners }) {
   
    const [currentPage, setCurrentPage] = useState(1);
    const partnersPerPage = 6; // Number of deliveries per page
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Calculate total pages
    const totalPages = Math.ceil(partners.length / partnersPerPage);

    // Get the current page's deliveries
    const startIndex = (currentPage - 1) * partnersPerPage;
    const currentpartners = partners.slice(startIndex, startIndex + partnersPerPage);

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };


    const handleViewDetails = (partnerId) => {
        console.log(`Navigating to ride details for ride ID: ${partnerId}`);
        // const ridedata = {
        //     'id':rideId,
        // }
        // dispatch(setRideData(ridedata))
        navigate(`/partnerdetail/${partnerId}`);
    };

    return (
        <div className="flex flex-col items-center justify-center">
            {/* Responsive Table Container */}
            <div className="w-full max-w-6xl px-4 overflow-x-auto">

                <Table className="table-auto border border-gray-200 shadow-lg">

                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px] p-4 text-left">-</TableHead>
                            <TableHead className="w-[150px] p-4 text-left">pickup</TableHead>
                            <TableHead className="w-[150px] p-4 text-left">To</TableHead>
                            <TableHead className="w-[150px] p-4 text-left">seats</TableHead>
                            <TableHead className="w-[150px] p-4 text-left">Status</TableHead>
                            <TableHead className=" w-[150px] p-4 text-left">more</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentpartners.map((partner, index) => (

                            <TableRow key={partner.id}>
                                <TableCell className=" p-4 font-medium">{startIndex + index + 1}</TableCell>
                                <TableCell className="p-4">{partner.pickup}, </TableCell>
                                <TableCell className="p-4">{partner.dropoff}</TableCell>
                                <TableCell className="p-4">{partner.seats}</TableCell>
                                <TableCell className="p-4">{partner.status}</TableCell>



                                <TableCell className="">
                                        <span
                                            className="text-blue-500 hover:underline cursor-pointer"
                                            onClick={() => handleViewDetails(partner.id)}
                                        >
                                            More
                                        </span>
                                    </TableCell>
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

export default Partnerlist;
