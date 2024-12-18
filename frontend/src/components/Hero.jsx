import React, {useState} from 'react'
import { ChevronRight, Package, Car, Star, Clock, Section } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'









const Hero = () => {

  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [showChoices, setShowChoices] = useState(false) // State to manage modal visibility

  const handleChoice = (path) => {
    setShowChoices(false) // Close modal
    navigate(path) // Navigate to the chosen path
  }

  return (
    <section className="relative h-screen flex items-center">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{backgroundImage: "url('/placeholder.svg?height=1080&width=1920&text=Community+Delivery+and+Ride-Sharing')"}}
          ></div>
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative container mx-auto px-6 text-center text-white z-10">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Empower Your Community
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
              Join CommunityGo - Where neighbors help neighbors with crowdsourced deliveries and ride-sharing.
            </p>


            {user ? (
            <div className="space-x-4">
         

      {/* Main Button */}
      <button
        onClick={() => setShowChoices(true)} // Open the modal
        className="bg-orange-500 text-white font-bold py-3 px-8 w-64 h-16 rounded-full text-lg inline-flex items-center justify-center text-center transition duration-300 ease-in-out hover:bg-orange-600 hover:scale-105 transform"
      >
        Start Delivering
        <Package className="ml-2" size={24} />
      </button>

      {/* Modal */}
      {showChoices && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center w-96">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              What would you like to do?
            </h3>
            <div className="space-y-4">
              <button
                onClick={() => handleChoice('/request-delivery')}
                className="bg-orange-500 text-white font-bold py-3 px-8 w-full rounded-full transition duration-300 ease-in-out hover:bg-orange-600"
              >
                Request a Delivery
              </button>
              <button
                onClick={() => handleChoice('/deliverysearch')}
                className="bg-gray-300 text-gray-800 font-bold py-3 px-8 w-full rounded-full transition duration-300 ease-in-out hover:bg-gray-400"
              >
                Start Delivering
              </button>
            </div>
            <button
              onClick={() => setShowChoices(false)} // Close the modal
              className="mt-6 text-gray-500 hover:text-gray-800 underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    
              <button className="bg-white text-orange-500 font-bold py-3 px-8 w-64 h-16 rounded-full text-lg inline-flex items-center justify-center text-center transition duration-300 ease-in-out hover:bg-gray-100 hover:scale-105 transform">
                Join a Ride
                <Car className="ml-2" size={24} />
              </button>
            </div>
            ):(

              <button onClick={() => navigate('/register')} className="bg-orange-500 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out hover:bg-orange-600 hover:scale-105 transform">
              Sign Up Now
            </button>
            )}
          </div>
        </section>


    
  )
}

export default Hero
