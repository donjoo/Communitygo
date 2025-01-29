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
  const [delivery_id, setDelivery_id] = useState();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  
  const [selectingPickup, setSelectingPickup] = useState(true);
  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [dropoffCoordinates, setDropoffCoordinates] = useState(null);
  const [image, setImage] = useState(null);
  const [routeDistance, setRouteDistance] = useState(null);


  // console.log(pickupCoordinates,dropoffCoordinates)
  if (pickupCoordinates) {
    console.log(pickupCoordinates.latitude)
  }
  const [formData, setFormData] = useState({
    from_address: '',
    from_city: '',
    from_postal_code: '',
    from_state: '',
    to_address: '',
    to_city: '',
    to_postal_code: '',
    to_state: '',
    package_size: 'SM',
    length:'',
    width:'',
    height:'',
    weight:'', // Default package size
    details: '', // Optional details
  });


  useEffect(() => {
    console.log('distance:',routeDistance)
  },[routeDistance])


  const packageSizes = [
    { value: 'SM', label: 'Small'},
    { value: 'MD', label: 'Medium' },
    { value: 'LG', label: 'Large' },
  ];



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };


  const validate = () => {
    let tempErrors = {};



    if (!pickupCoordinates) {
      tempErrors.pick_error = 'select pickup location'
    }

    if (!dropoffCoordinates) {
      tempErrors.drop_error = 'select drop off location'
    }




    if (!formData.from_address.trim()) {
      tempErrors.from_address = "address is required";
    } else if (formData.from_address.includes('.')) {
      tempErrors.from_address = "address cannnot contain a dot (.)";
    }


    if (!formData.from_city.trim()) {
      tempErrors.from_city = "city is required";
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
      tempErrors.from_state = "state is required";
    } else if (formData.from_state.includes('.')) {
      tempErrors.from_state = "state cannnot contain a dot (.)";
    }



    if (!formData.to_address.trim()) {
      tempErrors.to_address = "address is required";
    } else if (formData.to_address.includes('.')) {
      tempErrors.to_address = "address cannnot contain a dot (.)";
    }


    if (!formData.to_city.trim()) {
      tempErrors.to_city = "city is required";
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
      tempErrors.to_state = "state is required";
    } else if (formData.to_state.includes('.')) {
      tempErrors.to_state = "state cannnot contain a dot (.)";
    }


    if (formData.length && (isNaN(formData.length)|| formData.length <= 0 )) {
      tempErrors.lemgth = "Length must be a positive number";
    }



    if (formData.width && (isNaN(formData.width) || formData.width <= 0)){
      tempErrors.width = "width must be a positive number";
    }

    
    if (formData.height && (isNaN(formData.height) || formData.height <= 0)) {
      tempErrors.height = "Height must be a positive number";
    }


    if (formData.weight && (isNaN(formData.weight) || formData.weight <= 0)) {
      tempErrors.weight = "Weight must be a positive number";
    }


    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;

  };










  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user.username, 'user iddd');

    if (validate()) {
        console.log('Submitting:', formData);
        
        // Create FormData object
        const formDataa = new FormData();
        formDataa.append('user', user.id);
        const fromAddressData = {
          address_line_1: formData.from_address,
          city: formData.from_city,
          postal_code: formData.from_postal_code,
          state: formData.from_state,
          latitude: pickupCoordinates.latitude,
          longitude: pickupCoordinates.longitude
      };
      formDataa.append('from_address', JSON.stringify(fromAddressData));

      // Create nested to_address object
      const toAddressData = {
          address_line_1: formData.to_address,
          city: formData.to_city,
          postal_code: formData.to_postal_code,
          state: formData.to_state,
          latitude: dropoffCoordinates.latitude,
          longitude: dropoffCoordinates.longitude
      };
      formDataa.append('to_address', JSON.stringify(toAddressData));
        // Append other fields
        formDataa.append('package_size', formData.package_size);
        formDataa.append('details', formData.details);
        formDataa.append('distance', routeDistance);

        const courierId = formData.courier === 'undefined' ? null : formData.courier;
        if (courierId) {
            formData.append('courier', courierId);
        };

        formDataa.append('status', formData.status || 'PENDING');
        formDataa.append('height', formData.height);
        formDataa.append('length', formData.length);
        formDataa.append('width', formData.width);
        formDataa.append('weight', formData.weight);

        // Append the image file
        const imageFile = document.getElementById("image-upload").files[0]; // Assuming you have an input with id "image-upload"
        if (imageFile) {
            formDataa.append('image', imageFile); // Append the image file
        }

        try {
            const response = await api.post('request_delivery/', formDataa, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Important for file uploads
                }
            });

            if (response.status >= 200 && response.status < 300) {
                setDelivery_id(response.data.delivery_id);
                console.log(response.data.delivery_id, 'Delivery ID');
            }
        } catch (error) {
            console.error("Error submitting delivery request:", error.response.data);
        }
    }
};

  useEffect(() => {
    if (delivery_id) {
      navigate(`/delivery/payment/${delivery_id}`, { replace: true });
      // console.log("Replacing state:", `/delivery/payment/${delivery_id}`);
      // window.history.replaceState(null, null, `/delivery/payment/${delivery_id}`)
    }
  }, [delivery_id, navigate]);

  useEffect(() => {
    console.log(pickupCoordinates, dropoffCoordinates, 'euhf')
  }, [pickupCoordinates, dropoffCoordinates])



  return (
    <>
        <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Form Section */}
        <div className="flex-1 p-4 lg:p-6 bg-white overflow-y-auto">
          <main className="container mx-auto px-4 lg:px-6 py-8 lg:py-20">
            <h1 className="text-2xl lg:text-4xl font-bold text-center text-gray-800 mb-6 lg:mb-10">
              Create a Delivery Request
            </h1>
            
            <div className="bg-white shadow-lg rounded-lg p-4 lg:p-8 max-w-3xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                {/* From Address Section */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
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

                    <div>
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
                  </div>

                  <div className="space-y-4">
                    <div>
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

                    <div>
                      <label htmlFor="from_state" className="block text-gray-800 font-semibold mb-2">From State</label>
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
                  </div>
                </div>

                {/* To Address Section */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
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

                    <div>
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
                  </div>

                  <div className="space-y-4">
                    <div>
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

                    <div>
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
                  </div>
                </div>

                {/* Package Details Section */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="length" className="block text-gray-800 font-semibold mb-2">Length</label>
                      <input
                        type="text"
                        id="length"
                        name="length"
                        placeholder="Length"
                        value={formData.length}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      {errors.length && <span className='text-red-500 text-sm'>{errors.length}</span>}
                    </div>

                    <div>
                      <label htmlFor="width" className="block text-gray-800 font-semibold mb-2">Width</label>
                      <input
                        type="text"
                        id="width"
                        name="width"
                        placeholder="Width"
                        value={formData.width}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      {errors.width && <span className='text-red-500 text-sm'>{errors.width}</span>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="height" className="block text-gray-800 font-semibold mb-2">Height</label>
                    <input
                      type="text"
                      id="height"
                      name="height"
                      placeholder="Height"
                      value={formData.height}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.height && <span className='text-red-500 text-sm'>{errors.height}</span>}
                  </div>

                  <div>
                    <label htmlFor="weight" className="block text-gray-800 font-semibold mb-2">Weight</label>
                    <input
                      type="text"
                      id="weight"
                      name="weight"
                      placeholder="Weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.weight && <span className='text-red-500 text-sm'>{errors.weight}</span>}
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-800 font-semibold mb-2">Upload Image:</label>
                    <input 
                      type="file" 
                      id="image-upload" 
                      onChange={handleImageChange} 
                      className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    />
                  </div>
                  {image && (
                    <div className="mt-2">
                      <img src={URL.createObjectURL(image)} alt="Preview" className="max-w-xs rounded-lg" />
                    </div>
                  )}
                </div>

                {/* Additional Details Section */}
                <div>
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

                {/* Error Messages */}
                <div className="space-y-2">
                  {errors.pick_error && <span className='text-red-500 text-sm block'>{errors.pick_error}</span>}
                  {errors.drop_error && <span className='text-red-500 text-sm block'>{errors.drop_error}</span>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full md:w-auto bg-orange-500 text-white font-bold py-3 px-8 rounded-full text-lg inline-flex items-center justify-center transition duration-300 ease-in-out hover:bg-orange-600 hover:scale-105 transform"
                >
                  Submit Request
                  <Package className="ml-2" size={24} />
                </button>
              </form>
            </div>
          </main>
        </div>

        {/* Map Section */}
        <div className="h-96 lg:h-auto lg:flex-1 bg-gray-100 p-4">
          <div className="flex justify-center space-x-4 mb-4">
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

          <div className="h-full">
            <MapComponent
              selectingPickup={selectingPickup}
              onPickupSelect={(coords) => setPickupCoordinates(coords)}
              onDropoffSelect={(coords) => setDropoffCoordinates(coords)}
              onRouteDistance={(distance) => setRouteDistance(distance / 1000)}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
    </>

  );
}


