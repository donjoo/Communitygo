import React, { useEffect, useState } from 'react'
import Navbar from '../../../components/Navbar'
import { useSelector } from 'react-redux'
import api from '../../../api'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../component/ui/table"
import Navigation from '../../../components/map/Navigation'
import Partnerlist from '../../../components/common/Ride/Partnerlist'
import { useNavigate } from 'react-router-dom'


function JoinRequests() {

    const ride_Id = useSelector((state) => state.ride.id)
    const [ride, setRide] = useState(null);
    const [pendings, setPendings] = useState([])
    const [partners, setPartners] = useState([])
    const [start,setStart] = useState(null);
    const [end,setEnd] = useState(null);
    const navigate = useNavigate()

    const fetchJoinRequests = async () => {
        try {
       
            const response = await api.get(`${ride_Id}/make_a_ride/`);
            console.log(response.data)
            setRide(response.data.ride);
            setPendings(response.data.pending || [])
            setPartners(response.data.partners)
        } catch (errors) {

        }
    }






    const handleroute = (ride_id) => {
        const selectedRide = pendings.find((ride) => ride.id === ride_id);
            console.log('handle routtteee')
            if (selectedRide) {

                const {pickup_latitude,pickup_longitude, dropoff_latitude, dropoff_longitude} = selectedRide;

                setStart([pickup_longitude,pickup_latitude]);
                setEnd([dropoff_longitude,dropoff_latitude]);
            } else {
                console.error(`Ride with ID ${ride_id} not found.`);
            }

    }


    const handleAccept = async (partnerId) => {
        try {
            const response = await api.post(`ride-partner/accept/${partnerId}/`);
            console.log('Accepted:', response.data);
            fetchJoinRequests()
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    };

    const handleDecline = async (partnerId) => {
        try {
            const response = await api.post(`ride-partner/decline/${partnerId}/`);
            console.log('Declined:', response.data);
            fetchJoinRequests()
        } catch (error) {
            console.error('Error declining request:', error);
        }
    };


    const startRide = async () => {
        try {
            const respponse = await api.post(`ride/${ride_Id}/start/`)
            console.log('ride started')
            fetchJoinRequests()
        } catch (error) {

            console.log('error starting ride',error)
        }

    }

    const [currentPage, setCurrentPage] = useState(1);
    const pendingsPerPage = 6; // Number of deliveries per page
    const totalPages = Math.ceil(pendings.length / pendingsPerPage);
    const startIndex = (currentPage - 1) * pendingsPerPage;
    const currentpendings = pendings.slice(startIndex, startIndex + pendingsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };


    useEffect(() => {
        console.log('loadinggggggggggggggggggggggggg',ride_Id)
        // if (ride_Id) {
            fetchJoinRequests();
        // }
    }, [ride_Id]);



    if (!ride) {
        return <div>Loading...</div>; // Show loading state while fetching
    }




    return (
        <>  <Navbar />
        <div className="container mx-auto p-6 flex flex-col">
            {/* Upper Section - Ride Details and Your Ride Partners */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">Ride Details</h2>
                <div className="flex justify-between items-center mb-4">
                        <div>
                            <p><strong>Starting Point:</strong> {ride.route.starting_point}</p>
                            <p><strong>Endpoint:</strong> {ride.route.endpoint}</p>
                            <p><strong>Date:</strong> {ride.date}</p>
                            <p><strong>Starting Time:</strong> {ride.starting_time}</p>
                            <p><strong>Vehicle:</strong> {ride.vehicle}</p>
                            <p><strong>Available Seats:</strong> {ride.available_seats}</p>
                            <p><strong>Status:</strong> {ride.status}</p>
                        </div>
                        {/* Start Ride Button */}

                        {ride.status == 'pending' ? (
                        <button 
                            onClick={startRide}
                            className="ml-4 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Start Ride
                        </button>
                        ):(
                        
                            <button 
                            onClick={() => navigate(`/rideroute`)}
                            className="ml-4 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                             Show Route
                       </button>
                            )}
                    </div>
                

                {/* Your Ride Partners */}
                <h3 className="text-xl font-semibold mt-4">Your Ride Partners</h3>
                <Partnerlist partners={partners} />
            </div>

            {/* Lower Section - Requests to Join and Map */}
            <div className="flex">
                {/* Left Section - Requests to Join */}
                <div className="flex-1 mr-4">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4">Requests to Join Your Ride</h2>
                        <Table className="table-auto border border-gray-200 shadow-lg">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[150px] p-4 text-left">#</TableHead>
                                    <TableHead className="w-[150px] p-4 text-left">Pickup</TableHead>
                                    <TableHead className="w-[150px] p-4 text-left">To</TableHead>
                                    <TableHead className="w-[150px] p-4 text-left">Seats</TableHead>
                                    <TableHead className="w-[150px] p-4 text-left">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendings.map((partner, index) => (
                                    <TableRow key={partner.id} onClick={() => handleroute(partner.id)}>
                                        <TableCell className="p-4 font-medium">{index + 1}</TableCell>
                                        <TableCell className="p-4 font-medium">{partner.pickup}</TableCell>
                                        <TableCell className="p-4">{partner.dropoff}</TableCell>
                                        <TableCell className="p-4">{partner.seats}</TableCell>
                                        <TableCell className="p-4">
                                            <button
                                                className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAccept(partner.id);
                                                }}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 ml-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDecline(partner.id);
                                                }}
                                            >
                                                Decline
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Pagination Controls can be added here if needed */}
                    </div>
                </div>

                {/* Right Section - Map Display */}
                <div className="flex-none w-[400px]">
                    {/* Map component displaying route based on selected partner */}
                    {start && end ? (
                        <Navigation startlocation={start} endlocation={end} />
                    ) : (
                        <div className="bg-gray-200 h-full rounded-lg shadow-md flex items-center justify-center">
                            <h3>Select a request to see the route on the map.</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>

    )
}

export default JoinRequests

