import React, { useState } from 'react'
import Footer from '../../../components/Footer'
import Navbar from '../../../components/Navbar'
import MapComponent from '../../../components/map/MapComponent'
import api from '../../../api';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "../../../component/ui/table"
import Navigation from '../../../components/map/Navigation';
import { FaCar } from 'react-icons/fa'; // Importing a car icon from react-icons
import { Navigate, useNavigate } from 'react-router-dom';



function Join_a_ride() {
    const [startingPoint, setStartingPoint] = useState('');
    const [endpoint, setEndpoint] = useState('');
    const [rides, setRides] = useState([]);
    const [error, setError] = useState('');
    const [start,setStart] = useState(null);
    const [end,setEnd] = useState(null);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        setError('');
        setRides([]);

        try {
            // Construct the search query
            const response = await api.get('joinridesearch/', {
                params: {
                    starting_point: startingPoint,
                    endpoint: endpoint,
                },
            });

            // Set results from the API response
            setRides(response.data);
        } catch (err) {
            console.error(err);
            setError('An error occurred while fetching data.');
        }
    };

   
    const handleroute = (ride_id) => {
            const selectedRide = rides.find((ride) => ride.id === ride_id);
            console.log('handle routtteee')
            if (selectedRide) {

                const {start_latitude,start_longitude, end_latitude, end_longitude} = selectedRide.route;

                setStart([start_longitude,start_latitude]);
                setEnd([end_longitude,end_latitude]);
            } else {
                console.error(`Ride with ID ${ride_id} not found.`);
            }
    }



    const handleJoin = (ride_id) => {
        
        navigate(`/ridejoin/${ride_id}`);
      

    }

    const [currentPage, setCurrentPage] = useState(1)
    const ridesPerPage = 6;
    const totalPages = Math.ceil(rides.length / ridesPerPage);
    const startIndex = (currentPage - 1) * ridesPerPage;
    const currentrides  = rides.slice(startIndex,startIndex + ridesPerPage)

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }
  return (

<>

<Navbar />



    <div className="container mx-auto p-6">
      {/* Upper Section - Ride Details */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 grid grid-cols-2 gap-6">
        {/* Left Side - Ride Details */}
        <div>
        <h1 className="text-3xl font-bold mb-4">Search Ride Routes</h1>
            <form onSubmit={handleSearch} className="mb-6">
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <input
                        type="text"
                        placeholder="Starting Point"
                        value={startingPoint}
                        onChange={(e) => setStartingPoint(e.target.value)}
                        className="border border-gray-300 rounded-lg py-2 px-4 mb-4 md:mb-0"
                    />
                    <input
                        type="text"
                        placeholder="Endpoint"
                        value={endpoint}
                        onChange={(e) => setEndpoint(e.target.value)}
                        className="border border-gray-300 rounded-lg py-2 px-4 mb-4 md:mb-0"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                    >
                        Search
                    </button>
                </div>
            </form>
            {error && <div className="text-red-500 mb-4">{error}</div>}
      <Table  className="table-auto border border-gray-200 shadow-lg">
  
  <TableHeader>
    <TableRow>
      <TableHead className="w-[150px] p-4 text-left">-</TableHead>
      <TableHead className="w-[150px] p-4 text-left">From</TableHead>
      <TableHead className="w-[150px] p-4 text-left">To</TableHead>
      <TableHead className="w-[150px] p-4 text-left">vechile</TableHead>
      <TableHead className="w-[150px] p-4 text-left">available seats</TableHead>
      <TableHead className=" w-[150px] p-4 text-left">date</TableHead>
      <TableHead className="w-[150px] p-4 text-left">join</TableHead>

    </TableRow>
  </TableHeader>
  <TableBody>

     {currentrides.map((ride,index) => (
    
    <TableRow  key={ride.id} onClick={() => handleroute(ride.id)}>
           <TableCell className=" p-4 font-medium">{startIndex + index + 1}</TableCell>
          <TableCell className=" p-4 font-medium">{ride.route.starting_point}</TableCell>
          <TableCell className="p-4">{ride.route.endpoint}</TableCell>
          <TableCell className="p-4">{ride.vehicle}</TableCell>
          <TableCell className="p-4">{ride.available_seats}</TableCell>
          <TableCell className="p-4">{ride.date}{ride.time}</TableCell>
          <TableCell className="p-4">
      <button
        className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
        onClick={(e) => {
            e.stopPropagation(); // Prevents TableRow's onClick from triggering
            handleJoin(ride.id);
          }} // Prevents row click
      >
        Join
      </button>
    </TableCell>
        
    
    
          
        </TableRow>
        ))}

  </TableBody>

  </Table>

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

        {/* Right Side - Additional Info or Actions */}
        <div>

        {start && end ? (
        <Navigation startlocation={start} endlocation={end} />
      ) : (
       
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center transform transition-transform duration-300 hover:scale-105">
            <div className="flex justify-center mb-4">
                <FaCar className="text-blue-600 text-6xl" /> {/* Car icon */}
            </div>
            <h2 className="text-4xl font-bold text-blue-600 mb-4">Split Your Travel Cost</h2>
            <p className="text-md text-gray-700 mb-6">
                Share a ride with others to save money and make your journey more enjoyable!
            </p>
            <div className="flex justify-center mt-4">
                <img 
                    src="https://via.placeholder.com/150" // Replace with an actual image URL
                    alt="Ride Sharing"
                    className="rounded-full border border-gray-300 shadow-md"
                />
            </div>
            <p className="mt-4 text-gray-600">
                Join fellow travelers and reduce your expenses while enjoying the ride!
            </p>
           
        </div>
      )}
          
        </div>
      </div>

      {/* Lower Section - Requests to Join */}
      {/* <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Requests to Join Your Ride</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2 px-4 border-b">User</th>
              <th className="py-2 px-4 border-b">Requested Seats</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody> */}
            {/* {requestsToJoin.map(request => (
              <tr key={request.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{request.user}</td>
                <td className="py-2 px-4 border-b">{request.requestedSeats}</td>
                <td className="py-2 px-4 border-b">{request.status}</td>
              </tr>
            ))} */}
          {/* </tbody>
        </table> */}
      {/* </div> */}
    </div>


<Footer />
    </>
  )
}

export default Join_a_ride