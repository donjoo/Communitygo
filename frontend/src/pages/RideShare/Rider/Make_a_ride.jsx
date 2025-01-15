import React, { useState } from 'react'
import MapComponent from '../../../components/map/MapComponent'
import Footer from '../../../components/Footer'
import Navbar from '../../../components/Navbar'
import { MapPin,Car, Package, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../../api';
import RideMapComponent from '../../../components/Ride/map/makeride_map';
import { setRideData } from '../../../redux/ride/rideslice';


function Make_a_ride() {

    const user = useSelector((state) => state.auth.user);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const [selectingStartpoint,setSelectingStartpoint]  = useState(true);
    const [startCoordinates,setStartCoordinates] = useState(null)
    const [endCoordinates,setEndCoordinates] = useState(null)
    const [routeDistance, setRouteDistance] = useState(null);
    



    const [formData,setFormData] = useState({
        from:'',
        to:'',
        vehicle:'',
        available_seats:'',
        date:'',
        time:'',


    });


    const handleInputChange = (e) => {
        const {name , value} = e.target;
        setFormData({ ...formData,[name]:value});
    };

    const validate = () => {
        let tempErrors = {};

        if (!formData.from.trim()){
            tempErrors.from = "from is required";
        } else if (formData.from.includes('.')){
            tempErrors.from = "addres cannot contail a dot (.)";
        }



        if (!formData.to.trim()){
            tempErrors.to = "destination address is requied";
        } else if (formData.to.includes('.')){
            tempErrors.to = "adress cannot contain a dot (.)";
        }



        if (!formData.vehicle.trim()){
            tempErrors.vehicle = "vechile is required";
        } else if (formData.vehicle.includes('.')){
            tempErrors.vehicle = "vehicle cannot contain a dot (.)";
        }


        if (!formData.available_seats.trim()){
            tempErrors.available_seats = " no.of seats should be mentioned"
        } else if (formData.available_seats.includes('.')){
            tempErrors.available_seats = "available seats cannot contain a dot"
        }

        if (!formData.date.trim()){
            tempErrors.date = "date is required"
        }

        if (!formData.time.trim()){
            tempErrors.time = "time of ride is required"
        }

        if (!startCoordinates){
            tempErrors.startCoordinates = "select ride start location"
        }

        if (!endCoordinates){
            tempErrors.endCoordinates = 'select ride destination'
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(user.username)
        console.log(`start ${startCoordinates.latitude},${ startCoordinates.longitude},${endCoordinates.latitude},${endCoordinates.longitude}`)
        if (validate()) {

            const rideData = {
                user: user.id,
                route: {
                    starting_point: formData.from,
                    endpoint: formData.to,
                    start_latitude: startCoordinates.latitude,
                    start_longitude: startCoordinates.longitude,
                    end_latitude: endCoordinates.latitude,
                    end_longitude: endCoordinates.longitude
                },
                vehicle: formData.vehicle,
                available_seats: formData.available_seats,
                total_seats: formData.available_seats,
                date: formData.date,
                starting_time: formData.time
            };
            
            try{
                const response = await api.post('make_a_ride/',rideData);

                if (response.status >= 200 && response.status < 300) {
                    console.log(response.data,'ride_Id');
                    const ridedata = {
                      'id': response.data.ride_id,
                    }
                    
                    setFormData({
                      from:'',
                      to:'',
                      vehicle:'',
                      available_seats:'',
                      date:'',
                      time:'',
                    })
                    
                    dispatch(setRideData(ridedata));
                    navigate('/joinrequests')
                    
                }
            } catch (error){
                console.error("Error submitting make a ride",  error.response ? error.response.data : error.message);
            }


        }
        
    }

  return (
    <>
     <div className="flex flex-col min-h-screen">
        < Navbar />
        <div className=" mt- flex flex-1 overflow-hidden">
          <div className="flex-1 p-6 bg-white overflow-y-auto">
            <main className="container mx-auto px-6 py-20">
              <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Make a Ride</h1>
              <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl mx-auto">

                <form onSubmit={handleSubmit}>
                  {/* From Address */}
                  <div className="mb-6">
                    <label htmlFor="from" className="block text-gray-800 font-semibold mb-2">Starting from</label>
                    <input
                      type="text"
                      id="from"
                      name="from"
                      placeholder="Enter ride starting address"
                      value={formData.from}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.from && <span className='text-red-500 text-sm'>{errors.from}</span>}

                  </div>




                  {/* From City */}
                  <div className="mb-6">
                    <label htmlFor="from_city" className="block text-gray-800 font-semibold mb-2">Destination</label>
                    <input
                      type="text"
                      id="to"
                      name="to"
                      placeholder="Enter ride ending poin"
                      value={formData.to}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.to && <span className='text-red-500 text-sm'>{errors.to}</span>}

                  </div>

                  {/* From Postal Code */}
                  <div className="mb-6">
                    <label htmlFor="from_postal_code" className="block text-gray-800 font-semibold mb-2">Vehicle</label>
                    <input
                      type="text"
                      id="vehicle"
                      name="vehicle"
                      placeholder="vehicle"
                      value={formData.vehicle}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.vehicle && <span className='text-red-500 text-sm'>{errors.vehicle}</span>}
                  </div>

                  <div className="mb-6">
                    <label htmlFor="from_State" className="block text-gray-800 font-semibold mb-2">Number of available Seats</label>
                    <input
                      type="text"
                      id="available_seats"
                      name="available_seats"
                      placeholder="Enter available seats"
                      value={formData.available_seats}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.available_seats && <span className='text-red-500 text-sm'>{errors.available_seats}</span>}

                  </div>

                  {/* To Address */}
                  <div className="mb-6">
                    <label htmlFor="to_address" className="block text-gray-800 font-semibold mb-2">Date</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      placeholder="Date of ride"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.date && <span className='text-red-500 text-sm'>{errors.date}</span>}

                  </div>



                  {/* To City */}
                  <div className="mb-6">
                    <label htmlFor="to_city" className="block text-gray-800 font-semibold mb-2">Starting time</label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      placeholder="ride starting time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.time && <span className='text-red-500 text-sm'>{errors.time}</span>}

                  </div>
<div className='mb-6'>
                  {errors.startCoordinates && <span className='text-red-500 text-sm'>{errors.startCoordinates}</span>}
                  {errors.endCoordinates && <span className='text-red-500 text-sm'>{errors.endCoordinates}</span>}
                  </div>
                  <button
                    type="submit"
                    className="bg-orange-500 text-white font-bold py-3 px-8 rounded-full text-lg inline-flex items-center transition duration-300 ease-in-out hover:bg-orange-600 hover:scale-105 transform"
                  >
                    Submit Ride
                    <Car className="ml-2" size={24} />
                  </button>
                </form>
              </div>
            </main>

          </div>




          <div className="mt-30 mr-6 flex-1 bg-gray-100">
            <div className=" mt-5 flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setSelectingStartpoint(true)}
                className="bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition duration-300"
              >
                Select Pickup Location
              </button>
              <button
                onClick={() => setSelectingStartpoint(false)}
                className="bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition duration-300"
              >
                Select Dropoff Location
              </button>
            </div>

            <RideMapComponent
             selectingStartpoint={selectingStartpoint}
             onStartSelect={(coords) => setStartCoordinates(coords)}
             onEndSelect={(coords) => setEndCoordinates(coords)}
             onRouteDistance={(distance) => setRouteDistance(distance / 1000)}
            />
          </div>





        </div>

        <Footer />
      </div>
    </>
  )
}

export default Make_a_ride