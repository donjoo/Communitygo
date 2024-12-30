import React from 'react'

function Make_a_ride() {




  return (
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
                    <label htmlFor="length" className="block text-gray-800 font-semibold mb-2">Length</label>
                    <input
                      type="text"
                      id="length"
                      name="length"
                      placeholder="Enter State"
                      value={formData.length}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.length && <span className='text-red-500 text-sm'>{errors.length}</span>}

                  </div>


                  <div className="mb-6">
                    <label htmlFor="width" className="block text-gray-800 font-semibold mb-2">Width</label>
                    <input
                      type="text"
                      id="width"
                      name="width"
                      placeholder=" Enter width"
                      value={formData.width}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.width && <span className='text-red-500 text-sm'>{errors.width}</span>}

                  </div>



                  <div className="mb-6">
                    <label htmlFor="height" className="block text-gray-800 font-semibold mb-2"> Height</label>
                    <input
                      type="text"
                      id="height"
                      name="height"
                      placeholder="Enter height"
                      value={formData.height}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.height && <span className='text-red-500 text-sm'>{errors.height}</span>}

                  </div>



                  <div className="mb-6">
                    <label htmlFor="to_state" className="block text-gray-800 font-semibold mb-2">Weight</label>
                    <input
                      type="text"
                      id="weight"
                      name="weight"
                      placeholder="Enter weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.weight && <span className='text-red-500 text-sm'>{errors.weight}</span>}

                  </div>


                  <div>
                    {image && <img src={URL.createObjectURL(image)} alt="Preview" width="200" />}
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-800 font-semibold mb-2">
                      Upload Image:
                    </label>
                    <input type="file" id="image-upload" accept="image/*" />


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
  )
}

export default Make_a_ride