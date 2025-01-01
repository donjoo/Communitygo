import React, { useEffect, useState } from 'react'
import Navbar from '../../../components/Navbar'
import { useSelector } from 'react-redux'
import api from '../../../api'

function JoinRequests() {

    const ride_Id  = useSelector((state) => state.ride.id)
    const [ride,setRide] = useState(null);

    useEffect(() => {
        const fetchJoinRequests = async () => {
            try {
                const rid = 1
                const response = await api.get(`${rid}/make_a_ride`);
                console.log(response.data)
                setRide(response.data);
            } catch (errors){

            }
        }

        fetchJoinRequests()
    },[ride_Id])






  return (
<>
<Navbar />

<div className="container mx-auto p-6">
            {/* Upper Section - Ride Details */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">Ride Details</h2>
                <p><strong>Starting Point:</strong> {ride.route.starting_point}</p>
                <p><strong>Endpoint:</strong> {ride.route.endpoint}</p>
                <p><strong>Date:</strong> {ride.date}</p>
                <p><strong>Starting Time:</strong> {ride.starting_time}</p>
                <p><strong>Vehicle:</strong> {ride.vehicle}</p>
                <p><strong>Available Seats:</strong> {ride.available_seats}</p>
            </div>

            {/* Lower Section - Requests to Join */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Requests to Join Your Ride</h2>
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="py-2 px-4 border-b">User</th>
                            <th className="py-2 px-4 border-b">Requested Seats</th>
                            <th className="py-2 px-4 border-b">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {requestsToJoin.map(request => (
                            <tr key={request.id} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b">{request.user}</td>
                                <td className="py-2 px-4 border-b">{request.requestedSeats}</td>
                                <td className="py-2 px-4 border-b">{request.status}</td>
                            </tr>
                        ))} */}
                    </tbody>
                </table>
            </div>
        </div>
</>

  )
}

export default JoinRequests

