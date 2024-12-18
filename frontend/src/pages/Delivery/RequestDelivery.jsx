import React, { useEffect, useState } from 'react';
import { MapPin, Package } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../api'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../../components/map/MapComponent';



export default function DeliveryPage() {

  const user = useSelector((state) => state.auth.user);
  const [delivery_id,setDelivery_id] = useState();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();


  const [selectingPickup, setSelectingPickup] = useState(true);
  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [dropoffCoordinates, setDropoffCoordinates] = useState(null);

  // console.log(pickupCoordinates,dropoffCoordinates)
  if (pickupCoordinates){
    console.log(pickupCoordinates.latitude)
  }
  const [formData, setFormData] = useState({
    from_address: '',
    from_city: '',
    from_postal_code: '',
    from_state:'',
    to_address: '',
    to_city: '',
    to_postal_code: '',
    to_state:'',
    package_size: 'SM', // Default package size
    details: '', // Optional details
  });




  const packageSizes = [
    { value: 'SM', label: 'Small' },
    { value: 'MD', label: 'Medium' },
    { value: 'LG', label: 'Large' },
  ];



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };




  const validate =() => {
    let tempErrors = {};



    if (!pickupCoordinates){
    tempErrors.pick_error = 'select pickup location'
    }

    if (!dropoffCoordinates){
      tempErrors.drop_error = 'select drop off location'
    }



 
    if (!formData.from_address.trim()) {
      tempErrors.from_address  = "address is required";
    } else if (formData.from_address.includes('.')) {
      tempErrors.from_address = "address cannnot contain a dot (.)";
    }


    if (!formData.from_city.trim()) {
      tempErrors.from_city  = "city is required";
    } else if (formData.from_city.includes('.')) {
      tempErrors.from_city = "city cannnot contain a dot (.)";
    }


    if (!formData.from_postal_code.trim()) {
      tempErrors.from_postal_code = "postal_code is required";
    } else if (!/^\d+$/.test(formData.from_postal_code)) {  // Regex to check if only numbers are present
      tempErrors.from_postal_code = "postal_code can only contain numbers";
    } else if (formData.from_postal_code.includes('.')) {
      tempErrors.from_postal_code = "postal_code cannot contain a dot (.)";
    }
    
    
    if (!formData.from_state.trim()) {
      tempErrors.from_state  = "state is required";
    } else if (formData.from_state.includes('.')) {
      tempErrors.from_state = "state cannnot contain a dot (.)";
    }



    if (!formData.to_address.trim()) {
      tempErrors.to_address  = "address is required";
    } else if (formData.to_address.includes('.')) {
      tempErrors.to_address = "address cannnot contain a dot (.)";
    }


    if (!formData.to_city.trim()) {
      tempErrors.to_city  = "city is required";
    } else if (formData.to_city.includes('.')) {
      tempErrors.to_city = "city cannnot contain a dot (.)";
    }


    if (!formData.to_postal_code.trim()) {
      tempErrors.to_postal_code = "postal_code is required";
    } else if (!/^\d+$/.test(formData.to_postal_code)) {  // Regex to check if only numbers are present
      tempErrors.to_postal_code = "postal_code can only contain numbers";
    } else if (formData.to_postal_code.includes('.')) {
      tempErrors.to_postal_code = "postal_code cannot contain a dot (.)";
    }
    



    if (!formData.to_state.trim()) {
      tempErrors.to_state  = "state is required";
    } else if (formData.to_state.includes('.')) {
      tempErrors.to_state = "state cannnot contain a dot (.)";
    }







    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;

  };












  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user.username,'user iddd')
    if (validate()) {
    console.log('Submitting:', formData);
    const payload = {
      user:user.id,
      from_address: {
        address_line_1: formData.from_address,
        city: formData.from_city,
        postal_code: formData.from_postal_code,
        state: formData.from_state,
        latitude:pickupCoordinates.latitude,
        longitude:pickupCoordinates.longitude,
      },
      to_address: {
        address_line_1: formData.to_address,
        city: formData.to_city,
        postal_code: formData.to_postal_code,
        state: formData.to_state,
        latitude:dropoffCoordinates.latitude,
        longitude:dropoffCoordinates.longitude,
      },
      package_size: formData.package_size,
      details: formData.details,
      courier: formData.courier, // Ensure this is set
      status: formData.status || 'PENDING', // Set default if needed
    };
  

    try {
      const response = await api.post('request_delivery/', payload);

      if (response.status >= 200 && response.status < 300) {
        setDelivery_id(response.data.delivery_id)
        console.log(response.data.delivery_id,'responseeeeeeee')
        console.log(delivery_id,'deliveryiddd')
        alert('Delivery request submitted successfully!');
        setFormData({
          from_address: '',
          from_city: '',
          from_postal_code: '',
          from_state:'',
          to_address: '',
          to_city: '',
          to_postal_code: '',
          to_state:'',
          package_size: 'SM',
          details: '',
        });
      } else {
        alert('Failed to submit delivery request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again later.');
    }
  }
  };


  useEffect(() => {
    if (delivery_id) {
      navigate(`/deliverydetail/${delivery_id}`);
    }
  }, [delivery_id, navigate]);

 useEffect(() => {
  console.log(pickupCoordinates,dropoffCoordinates,'euhf')
 },[pickupCoordinates,dropoffCoordinates])

  

  return (
     <>
     <div className="flex flex-col min-h-screen">
     < Navbar />
     <div className=" mt- flex flex-1 overflow-hidden">
     <div className="flex-1 p-6 bg-white overflow-y-auto">
      <main className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Create a Delivery Request</h1>
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl mx-auto">
      
          <form onSubmit={handleSubmit}>
            {/* From Address */}
            <div className="mb-6">
              <label htmlFor="from_address" className="block text-gray-800 font-semibold mb-2">From Address</label>
              <input
                type="text"
                id="from_address"
                name="from_address"
                placeholder="Enter pickup address"
                value={formData.from_address}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            {errors.from_address && <span className='text-red-500 text-sm'>{errors.from_address}</span>}

            </div>

         


            {/* From City */}
            <div className="mb-6">
              <label htmlFor="from_city" className="block text-gray-800 font-semibold mb-2">From City</label>
              <input
                type="text"
                id="from_city"
                name="from_city"
                placeholder="Enter city"
                value={formData.from_city}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.from_city && <span className='text-red-500 text-sm'>{errors.from_city}</span>}

            </div>

            {/* From Postal Code */}
            <div className="mb-6">
              <label htmlFor="from_postal_code" className="block text-gray-800 font-semibold mb-2">From Postal Code</label>
              <input
                type="text"
                id="from_postal_code"
                name="from_postal_code"
                placeholder="Enter postal code"
                value={formData.from_postal_code}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
                {errors.from_postal_code && <span className='text-red-500 text-sm'>{errors.from_postal_code}</span>}
            </div>

            <div className="mb-6">
              <label htmlFor="from_State" className="block text-gray-800 font-semibold mb-2">From State</label>
              <input
                type="text"
                id="from_state"
                name="from_state"
                placeholder="Enter State"
                value={formData.from_state}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
                {errors.from_state && <span className='text-red-500 text-sm'>{errors.from_state}</span>}

            </div>

            {/* To Address */}
            <div className="mb-6">
              <label htmlFor="to_address" className="block text-gray-800 font-semibold mb-2">To Address</label>
              <input
                type="text"
                id="to_address"
                name="to_address"
                placeholder="Enter drop-off address"
                value={formData.to_address}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.to_address && <span className='text-red-500 text-sm'>{errors.to_address}</span>}

            </div>

           

            {/* To City */}
            <div className="mb-6">
              <label htmlFor="to_city" className="block text-gray-800 font-semibold mb-2">To City</label>
              <input
                type="text"
                id="to_city"
                name="to_city"
                placeholder="Enter city"
                value={formData.to_city}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.to_city && <span className='text-red-500 text-sm'>{errors.to_city}</span>}

            </div>

            {/* To Postal Code */}
            <div className="mb-6">
              <label htmlFor="to_postal_code" className="block text-gray-800 font-semibold mb-2">To Postal Code</label>
              <input
                type="text"
                id="to_postal_code"
                name="to_postal_code"
                placeholder="Enter postal code"
                value={formData.to_postal_code}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.to_postal_code && <span className='text-red-500 text-sm'>{errors.to_postal_code}</span>}

            </div>

            <div className="mb-6">
              <label htmlFor="to_state" className="block text-gray-800 font-semibold mb-2">To State</label>
              <input
                type="text"
                id="to_state"
                name="to_state"
                placeholder="Enter State"
                value={formData.to_state}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
                {errors.to_state && <span className='text-red-500 text-sm'>{errors.to_state}</span>}

            </div>






            {/* Other Fields */}
            <div className="mb-6">
              <label htmlFor="package_size" className="block text-gray-800 font-semibold mb-2">Package Size</label>
              <select
                id="package_size"
                name="package_size"
                value={formData.package_size}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {packageSizes.map((size) => (
                  <option key={size.value} value={size.value}>{size.label}</option>
                ))}
              </select>
            </div>

          

            <div className="mb-6">
              <label htmlFor="details" className="block text-gray-800 font-semibold mb-2">Additional Details (Optional)</label>
              <textarea
                id="details"
                name="details"
                rows="4"
                placeholder="Enter additional instructions"
                value={formData.details}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
              ></textarea>
            </div>
            {errors.pick_error && <span className='text-red-500 text-sm'>{errors.pick_error}</span>}
            {errors.drop_error && <span className='text-red-500 text-sm'>{errors.drop_error}</span>}

            <button
              type="submit"
              className="bg-orange-500 text-white font-bold py-3 px-8 rounded-full text-lg inline-flex items-center transition duration-300 ease-in-out hover:bg-orange-600 hover:scale-105 transform"
            >
              Submit Request
              <Package className="ml-2" size={24} />
            </button>
          </form>
        </div>
      </main>

      </div>




      <div className="mt-30 mr-6 flex-1 bg-gray-100">
      <div className=" mt-5 flex justify-center space-x-4 mb-6">
      <button
        onClick={() => setSelectingPickup(true)}
        className="bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition duration-300"
      >
        Select Pickup Location
      </button>
      <button
        onClick={() => setSelectingPickup(false)}
        className="bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition duration-300"
      >
        Select Dropoff Location
      </button>
    </div>
    
          <MapComponent selectingPickup={selectingPickup}
                        onPickupSelect={(coords) => setPickupCoordinates(coords)}
                        onDropoffSelect={(coords) => setDropoffCoordinates(coords)} 
                        />
        </div>





      </div>

  <Footer />
  </div>
</>

  );
}






