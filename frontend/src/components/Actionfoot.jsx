import React from 'react'
import { useNavigate } from 'react-router-dom'

function Actionfoot() {

  const navigate = useNavigate();

  return (
    <div>
      <section className="bg-gray-800 text-white py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6">Join Your Local CommunityGo Network</h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto">
              Whether you're looking to earn extra income, save on transportation, or just help out your neighbors, 
              CommunityGo has something for everyone. Sign up today and be part of the sharing revolution!
            </p>
            <div className="space-x-6">
              <button onClick={() => navigate('/register')} className="bg-orange-500 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out hover:bg-orange-600 hover:scale-105 transform">
                Sign Up Now
              </button>
              <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out hover:bg-white hover:text-gray-800 hover:scale-105 transform">
                Learn More
              </button>
            </div>
          </div>
        </section>
    </div>
  )
}

export default Actionfoot
