import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../component/ui/table";
import adminAxiosInstance from "../../adminaxiosconfig";
import Navigation from "../../components/map/Navigation";

function AdminRideDetail() {
    const { ride_Id } = useParams();
    const [ride, setRide] = useState(null);
    const [pendings, setPendings] = useState([]);
    const [partners, setPartners] = useState([]);
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const partnersPerPage = 6;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRideDetails = async () => {
            try {
                const response = await adminAxiosInstance.get(`ride/${ride_Id}/ridedetail`);
                setRide(response.data.ride);
                setPendings(response.data.pending || []);
                setPartners(response.data.partners);
                setStart([
                    response.data.ride.route.start_longitude,
                    response.data.ride.route.start_latitude,
                ]);
                setEnd([
                    response.data.ride.route.end_longitude,
                    response.data.ride.route.end_latitude,
                ]);
            } catch (errors) {
                console.error("Error fetching ride details:", errors);
            }
        };

        if (ride_Id) {
            fetchRideDetails();
        }
    }, [ride_Id]);

    const totalPages = Math.ceil(partners.length / partnersPerPage);
    const startIndex = (currentPage - 1) * partnersPerPage;
    const currentPartners = partners.slice(startIndex, startIndex + partnersPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleViewDetails = (partnerId) => {
        navigate(`/Adminpartnerdetail/${partnerId}`);
    };

    if (!ride) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Ride Details and Map Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ride Details */}
                <div className="bg-white p-6 shadow-md rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4">Ride Details</h2>
                    <div className="space-y-2">
                        <p><strong>Starting Point:</strong> {ride.route.starting_point}</p>
                        <p><strong>Endpoint:</strong> {ride.route.endpoint}</p>
                        <p><strong>Date:</strong> {ride.date}</p>
                        <p><strong>Starting Time:</strong> {ride.starting_time}</p>
                        <p><strong>Vehicle:</strong> {ride.vehicle}</p>
                        <p><strong>Total Seats:</strong> {ride.total_seats}</p>
                        <p><strong>Available Seats:</strong> {ride.available_seats}</p>
                        <p><strong>Status:</strong> {ride.status}</p>
                    </div>
                </div>

                {/* Map Section */}
                <div className="bg-white p-6 shadow-md rounded-lg flex items-center justify-center">
                    {start && end ? (
                        <Navigation startlocation={start} endlocation={end} />
                    ) : (
                        <div className="text-gray-500">Loading map...</div>
                    )}
                </div>
            </div>

            {/* Ride Partners Section */}
            <div className="bg-white p-6 shadow-md rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Ride Partners</h3>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Pickup</TableHead>
                                <TableHead>Dropoff</TableHead>
                                <TableHead>Seats</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>More</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentPartners.map((partner, index) => (
                                <TableRow key={partner.id}>
                                    <TableCell>{startIndex + index + 1}</TableCell>
                                    <TableCell>{partner.pickup}</TableCell>
                                    <TableCell>{partner.dropoff}</TableCell>
                                    <TableCell>{partner.seats}</TableCell>
                                    <TableCell>{partner.status}</TableCell>
                                    <TableCell>
                                        <span
                                            className="text-blue-500 hover:underline cursor-pointer"
                                            onClick={() => handleViewDetails(partner.id)}
                                        >
                                            View
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-4 space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 rounded ${currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminRideDetail;
