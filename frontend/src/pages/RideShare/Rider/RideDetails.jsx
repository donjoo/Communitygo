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
import Footer from '../../../components/Footer'
import ChatRoom from '../../Chat/ChatRoom'

function RideDetails() {

    const ride_Id = useSelector((state) => state.ride.id)
    const [ride, setRide] = useState(null);
    const [pendings, setPendings] = useState([])
    const [partners, setPartners] = useState([])
    const navigate = useNavigate()

    const fetchRideDetails = async () => {
        try {
            const response = await api.get(`${ride_Id}/make_a_ride`);
            console.log(response.data)
            setRide(response.data.ride);
            setPendings(response.data.pending || [])
            setPartners(response.data.partners)
        } catch (errors) {

        }
    }




    useEffect(() => {
        console.log('loadinggggggggggggggggggggggggg')
        if (ride_Id) {
            fetchRideDetails();
        }
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
                            <p><strong>Total Seats:</strong> {ride.total_seats}</p>
                            <p><strong>Available Seats:</strong> {ride.available_seats}</p>
                            <p><strong>Status:</strong> {ride.status}</p>
                        </div>

                    </div>

                    

                    {/* Your Ride Partners */}
                    <h3 className="text-xl font-semibold mt-4">Your Ride Partners</h3>
                    <Partnerlist partners={partners} />
                </div>

                {/* Lower Section - Requests to Join and Map */}

            </div>
        </>
    )
}

export default RideDetails