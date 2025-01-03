import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import api from '../../../api';
import { useSelector } from 'react-redux';
import Navbar from '../../../components/Navbar';
import RideMapComponent from '../../../components/Ride/map/makeride_map';
import Footer from '../../../components/Footer';
import { FaCar } from 'react-icons/fa'; // Importing a car icon from react-icons
import { ChevronsLeftRightEllipsis } from 'lucide-react';
import Navigation from '../../../components/map/Navigation';

function RideJoin() {
    const [pickup, setPickup] = useState();
    const [dropoff, setDropoff] = useState();
    const { ride_id } = useParams();
    const user = useSelector((state) => state.auth.user)
    const [ride, setRide] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState(1); // State for selected seats
    const navigate   = useNavigate()

    const [showDirection,setShowDirection] = useState(true)
    const [start,setStart] = useState(null)
    const [end,setEnd] = useState(null)


    const [selectingStartpoint, setSelectingStartpoint] = useState(true);
    const [startCoordinates, setStartCoordinates] = useState(null)
    const [endCoordinates, setEndCoordinates] = useState(null)
    const [error, setError] = useState();



    useEffect(() => {

        const fetchRideDetails = async () => {
            try {
                const response = await api.get(`${ride_id}/make_a_ride`);
                if (response.status === 200) {
                    setRide(response.data.ride);
                    const {start_latitude,start_longitude, end_latitude, end_longitude} = response.data.ride.route;

                    setStart([start_longitude,start_latitude]);
                    setEnd([end_longitude,end_latitude]);

                    console.log('Ride data fetched:', response.data);
                } else {
                    console.log('Couldn’t fetch ride data');
                    setError('Couldn’t fetch ride data');
                }
            } catch (err) {
                console.error('Error fetching ride details:', err);
                setError('Error fetching ride details');
            }
        };

        if (ride_id) { // Check if ride_id is available
            fetchRideDetails();
        }
    }, [ride_id]); // Dependency array includes ride_id


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('data submiteddddddd')

        if (!pickup || !dropoff || !startCoordinates || !endCoordinates || selectedSeats <= 0) {
            alert("Please fill in all required fields and select at least one seat.");
            return; // Exit the function if validation fails
        }

        const rideData = {
            user: user.id,
            ride: ride_id,
            pickup: pickup,
            dropoff: dropoff,
            pickup_latitude: startCoordinates.latitude,
            pickup_longitude: startCoordinates.longitude,
            dropoff_latitude: endCoordinates.latitude,
            dropoff_longitude: endCoordinates.longitude,
            seats: selectedSeats // Include selected seats in the request

        }
        try {
            const response = await api.post('joinride/', rideData)

            if (response.status >= 200 && response.status < 300) {
                // console.log(response.data.patner.id)
                navigate(`/partner/ridedetail/${ride_id}`)
            }
        } catch (error) {
            console.log(error.response);
        }
    }

    if (!ride) {
        return <div>Loading...</div>; // Show loading state while fetching
    }

    return (


        <>

            <Navbar />



            <div className="container mx-auto p-6">
                {/* Upper Section - Ride Details */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-6 grid grid-cols-2 gap-6">
                    {/* Left Side - Ride Details */}
                    <div>

                        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">

                            <h2 className="text-4xl font-bold text-blue-600 mb-4">Ride Details</h2>


                            {/* Ride Details */}
                            <div className="text-left mb-6">

                                <p><strong>Starting Point:</strong> {ride.route?.starting_point}</p>
                                <p><strong>Endpoint:</strong> {ride.route?.endpoint}</p>
                                <p><strong>Date:</strong> {ride.date}</p>
                                <p><strong>Starting Time:</strong> {ride.starting_time}</p>
                                <p><strong>Vehicle:</strong> {ride.vehicle}</p>
                                <p><strong>Available Seats:</strong> {ride.available_seats}</p>
                            </div>

                            {/* Button to View Directions */}
                            <button
                                onClick={() =>  setShowDirection(true)} // Replace with actual navigation logic
                                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                            >
                                View Directions
                            </button>
                        </div>



                        <h1 className="text-3xl font-bold mb-4">Request to Join the Ride</h1>

                        <form onSubmit={handleSubmit} className="mb-6">
                            <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl mx-auto">
                                {/* Pickup Input */}
                                <div className=" mt-1 flex  space-x-4">
                                    <div className="mb-1">
                                        <label htmlFor="pickup" className="block text-gray-800 font-semibold mb-2">Your Pickup Address</label>
                                        <input
                                            type="text"
                                            placeholder="Pickup"
                                            value={pickup}
                                            onChange={(e) => setPickup(e.target.value)}
                                            className="border border-gray-300 rounded-lg py-2 px-4 mb-4 md:mb-0"
                                        />
                                        {/* Button to Select Pickup Location */}

                                    </div>

                                    <div className="w-auto">
                                        <label htmlFor="seats" className="block text-gray-800 font-semibold mb-2">Select Seats</label>
                                        <select
                                            value={selectedSeats}
                                            onChange={(e) => setSelectedSeats(Number(e.target.value))}
                                            className="border border-gray-300 rounded-lg py-2 px-4"
                                        >
                                            {[...Array(ride.available_seats)].map((_, index) => (
                                                <option key={index} value={index + 1}>
                                                    {index + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>  {setShowDirection(false);
                                        setSelectingStartpoint(true);}} // Replace with actual location selection logic
                                    className="mt-2 bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition duration-200"
                                >
                                    Select pickup Location
                                </button>

                                {/* Dropoff Input and Seats Selection Side by Side */}

                                {/* Dropoff Input */}
                                <div className="mt-4">
                                    <label htmlFor="dropoff" className="block text-gray-800 font-semibold mb-2">Your Dropoff Address</label>
                                    <input
                                        type="text"
                                        placeholder="Dropoff"
                                        value={dropoff}
                                        onChange={(e) => setDropoff(e.target.value)}
                                        className="border border-gray-300 rounded-lg py-2 px-4 mb-4 md:mb-0"
                                    />
                                    {/* Button to Select Dropoff Location */}

                                </div>

                                <div className='mb-4'>
                                <button
                                    type="button"
                                    onClick={() => {setShowDirection(false);
                                        setSelectingStartpoint(false);}} // Replace with actual location selection logic
                                    className="mt-2 bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition duration-200"
                                >
                                    Select dropoff Location
                                </button>
                                </div>




                                {/* Submit Button */}
                                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                                    Request
                                </button>
                            </div>
                        </form>
                        {error && <div className="text-red-500 mb-4">{error}</div>}



                    </div>


                    {/* Right Side - Additional Info or Actions */}
                    <div>

                        {showDirection && start ? (
                               <Navigation  startlocation={start} endlocation={end} />
                        ) : (

                            < RideMapComponent
                                    selectingStartpoint={selectingStartpoint}
                                    onStartSelect={(coords) => setStartCoordinates(coords)}
                                    onEndSelect={(coords) => setEndCoordinates(coords)}
                                />
                        )}

                    </div>

                </div>


            </div>


            <Footer />
        </>

    )
}

export default RideJoin