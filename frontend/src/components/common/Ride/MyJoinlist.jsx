import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../component/ui/table";
import { debounce } from 'lodash';

function MyJoinlist({ joins }) {
    const [currentPage, setCurrentPage] = useState(1);
    const joinsPerPage = 6;
    const navigate = useNavigate();
    const [filteredRides, setFilteredRides] = useState(joins || []);
    const [searchQuery, setSearchQuery] = useState('');

    const totalPages = Math.ceil(filteredRides.length / joinsPerPage);
    const startIndex = (currentPage - 1) * joinsPerPage;
    const currentjoins = filteredRides.slice(startIndex, startIndex + joinsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleViewDetails = (partnerId) => {
        navigate(`/partner/ridedetail/${partnerId}`);
    };

    const debouncedSearch = debounce((query) => {
        const filtered = joins.filter(
            (ride) =>
                ride.pickup.toLowerCase().includes(query) ||
                ride.dropoff.toLowerCase().includes(query) ||
                ride.status.toLowerCase().includes(query)
        );
        setFilteredRides(filtered);
    }, 300);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        debouncedSearch(query);
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-6xl px-4 overflow-x-auto">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search by pickup, dropoff, or status"
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
                            <TableHead className="w-[150px] p-4 text-left">Seats Shared</TableHead>
                            <TableHead className="w-[150px] p-4 text-left">Status</TableHead>
                            <TableHead className="w-[150px] p-4 text-left">Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentjoins.map((ride, index) => (
                            <TableRow key={ride.id}>
                                <TableCell className="p-4 font-medium">{startIndex + index + 1}</TableCell>
                                <TableCell className="p-4">{ride.pickup}</TableCell>
                                <TableCell className="p-4">{ride.dropoff}</TableCell>
                                <TableCell className="p-4">{ride.seats}</TableCell>
                                <TableCell className="p-4">{ride.status}</TableCell>
                                <TableCell>
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
            </div>
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
