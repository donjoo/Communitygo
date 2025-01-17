import React, { useEffect, useState } from 'react'
import Navbar from '../../../components/Navbar'
import { useSelector } from 'react-redux'
import api from '../../../api'
import Navigation from '../../../components/map/Navigation'
import Partnerlist from '../../../components/common/Ride/Partnerlist'
import { useNavigate, useParams } from 'react-router-dom'
import Footer from '../../../components/Footer'
import ChatRoom from '../../Chat/ChatRoom'
import { Button } from '../../../component/ui/button';
import RatingCard from "../../../components/common/Rating";

function RideDetail() {

    const { partner_id } = useParams();
    const [ride, setRide] = useState(null);
    const [pendings, setPendings] = useState([])
    const [partner, setPartner] = useState()
    const [user,setUser] = useState()
    const [start,setStart] = useState(null);
    const [end,setEnd] = useState(null);
    const navigate = useNavigate()
    const [showChat, setShowChat] = useState(false);
    

    const fetchRideDetails = async () => {
        try {
            const response = await api.get(`partner/${partner_id}/ridedetail/`);
            console.log(response.data)
            setPartner(response.data.partner)
            setRide(response.data.ride);
            setUser(response.data.user)
            
            setEnd([response.data.partner.dropoff_longitude,response.data.partner.dropoff_latitude])
            setStart([response.data.partner.pickup_longitude,response.data.partner.pickup_latitude])
        
        } catch (errors) {

        }
    }

const handleCancel = async() => {
    try {
        const response = await api.post(`partner/${partner_id}/cancel/`)
        console.log('Cancled',response.data)
        fetchRideDetails()
    } catch (error) {
        console.error('Error accepting request:',error);
    }
}


const CompletePayment = () => {
    navigate(`/ride/payment/${partner_id}`)
}


const handleRatingSubmit = async (rating,feedback) => {
    try {
     const response =  await api.post(`${partner_id}/rateride/`, { rating,feedback });
     if (response.status === 200) {
            alert("Rating submitted successfully!");
          
          } else {
            alert("Failed to submit rating. Please try again.");
          }
     
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };



    useEffect(() => {
        console.log('loadinggggggggggggggggggggggggg')
        if (partner_id) {
            fetchRideDetails();
        }
    }, [partner_id]);



    if (!ride) {
        return <div>Loading...</div>; // Show loading state while fetching
    }

    
    return (
        <> 
        <Navbar />
        <div className="container mx-auto p-6 flex flex-col md:flex-row">
            {/* Left Section - Ride Details */}
            <div className="flex-1 bg-white shadow-md rounded-lg p-6 mb-6 md:mr-4">
                <h2 className="text-2xl font-semibold mb-4">Ride Details</h2>
                <div className="flex flex-col mb-4">
                    <p><strong>Starting Point:</strong> {ride.route.starting_point}</p>
                    <p><strong>Endpoint:</strong> {ride.route.endpoint}</p>
                    <p><strong>Date:</strong> {ride.date}</p>
                    <p><strong>Starting Time:</strong> {ride.starting_time}</p>
                    <p><strong>Vehicle:</strong> {ride.vehicle}</p>
                    <p><strong>Total Seats:</strong> {ride.total_seats}</p>
                    <p><strong>Available Seats:</strong> {ride.available_seats}</p>
                    <p><strong>Status:</strong> {ride.status}</p>
                </div>
                <h2 className="text-2xl font-semibold mb-4">Your Pickup Details</h2>
                <div className="flex flex-col mb-4">
                    <p><strong>Pickup Point:</strong> {partner.pickup}</p>
                    <p><strong>Dropoff Point:</strong> {partner.dropoff}</p>
                    <p><strong>seats:</strong> {partner.seats}</p>
                    <p><strong>Status:</strong> {partner.status}</p>
                    <p><strong>Status:</strong> {user.username}</p>

                </div>

                {/* Conditional Cancel Button */}
                {(partner.status === 'pending' || partner.status === 'accepted') && (
                    <button 
                        onClick={handleCancel} 
                        className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
                    >
                        Cancel
                    </button>
                )}

                {(!partner?.rating && partner.status === 'dropedoff') && (
                <div className="w-full">
                  <RatingCard partnerId={partner?.id} onSubmit={handleRatingSubmit} />
                </div>
              )}

                 <div className=" mt-5">
              {!partner.payment_done && partner.status !== 'canceled' ? (
                <div>
                < p className="md-3 font-semibold text-lg text-red-600">payment not done:</p>
                <Button onClick={CompletePayment} >Complete payment</Button>
                </div>
              ):null}
             </div>

            </div>



            {/* Right Section - Map Display */}
            <div className="flex-1 bg-gray-100 rounded-lg shadow-md p-4">
                {start && end ? (
                    <Navigation startlocation={start} endlocation={end} />
                ) : (
                    <div className="bg-gray-200 h-full rounded-lg shadow-md flex items-center justify-center">
                        <h3>Loading map...</h3>
                    </div>
                )}
            </div>
        </div>

        {/* Optional Footer */}
        {/* Uncomment if you want to include the footer */}
        <Footer />
        <Button
      className="fixed bottom-4 right-4 z-50"
      onClick={() => setShowChat(!showChat)}
    >
      {showChat ? 'Close Chat' : 'Open Chat'}
    </Button>

    {showChat && (
      <div className="fixed bottom-16 right-4 z-50 w-96 h-[calc(100vh-6rem)] max-h-[32rem] bg-white shadow-lg rounded-lg overflow-hidden">
        <ChatRoom receiverUsername={user.username} />
      </div>
    )}
    </>
    )
}

export default RideDetail