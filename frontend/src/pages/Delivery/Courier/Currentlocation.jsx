import React, { useState } from 'react'
import MapComponent from '../../../components/map/MapComponent'
import api from '../../../api';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

function Currentlocation() {

    const {deliveryId} = useParams();
    const [selecting, setSelectingPick] = useState(true);
    const [currLocation, setCurrLocation] = useState(null);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        console.log('clickedd')
        e.preventDefault();
        if (currLocation){
            const payload ={
                latitude:currLocation.latitude,
                longitude:currLocation.longitude,
            }
        


        try {
            const response = await api.post(`courier_currlocation/${deliveryId}/`,payload);
            if (response.status === 200){
                console.log('Location updated successfully:', response.data);
                navigate(`/courierdetail/${deliveryId}`);        }
        }catch (error){
          console.log('Error accepting delivery', error)
        }
    
    }
    }
  return (
    <>
    
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className=" mt- flex flex-1 overflow-hidden">
        {/* Right Side: Details */}
        <div className="flex-1 p-6 bg-white overflow-y-auto">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Select Your location</h1>
          <p className="text-gray-600">
<button onClick={handleSubmit}>Submit</button>
          </p>
        </div>

        {/* Left Side: Map */}
        <div className=" mb-4 mr-6 flex-1 bg-gray-100">
          {/* <MapComponent /> */}
         < MapComponent selectingPickup={selecting} onPickupSelect={(coords) => setCurrLocation(coords)}/>
        </div>
      </div>
      <Footer />
    </div>
    </>
  )
}

export default Currentlocation