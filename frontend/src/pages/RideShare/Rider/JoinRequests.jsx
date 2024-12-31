import React from 'react'
import Navbar from '../../../components/Navbar'

function JoinRequests() {



    const rideDetails = {
        startingPoint: "Vytila",
        endpoint: "Edappally",
        date: "2025-01-01",
        startingTime: "04:46",
        vehicle: "Car",
        availableSeats: 4,
    };

    const requestsToJoin = [
        { id: 1, user: "John Doe", requestedSeats: 2, status: "Pending" },
        { id: 2, user: "Jane Smith", requestedSeats: 1, status: "Accepted" },
        { id: 3, user: "Alice Johnson", requestedSeats: 3, status: "Pending" },
    ];





  return (
<>
<Navbar />

<div className="container mx-auto p-6">
            {/* Upper Section - Ride Details */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">Ride Details</h2>
                <p><strong>Starting Point:</strong> {rideDetails.startingPoint}</p>
                <p><strong>Endpoint:</strong> {rideDetails.endpoint}</p>
                <p><strong>Date:</strong> {rideDetails.date}</p>
                <p><strong>Starting Time:</strong> {rideDetails.startingTime}</p>
                <p><strong>Vehicle:</strong> {rideDetails.vehicle}</p>
                <p><strong>Available Seats:</strong> {rideDetails.availableSeats}</p>
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
                        {requestsToJoin.map(request => (
                            <tr key={request.id} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b">{request.user}</td>
                                <td className="py-2 px-4 border-b">{request.requestedSeats}</td>
                                <td className="py-2 px-4 border-b">{request.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
</>

  )
}

export default JoinRequests

