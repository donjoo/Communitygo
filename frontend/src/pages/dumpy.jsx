import React from 'react'
import { ChevronRight, Package, Car, Users, Clock, MapPin, Shield } from 'lucide-react'

const features = [
  { icon: Package, title: "Crowdsourced Deliveries", description: "Connect with local couriers for quick and efficient deliveries." },
  { icon: Car, title: "Community Ride-Sharing", description: "Share rides with community members going your way." },
  { icon: Users, title: "Build Your Network", description: "Grow your local connections as you deliver or ride." },
  { icon: Clock, title: "Flexible Scheduling", description: "Choose when you want to deliver or ride, on your terms." },
  { icon: MapPin, title: "Local Focus", description: "Support and strengthen your local community." },
  { icon: Shield, title: "Trust & Safety", description: "Verified users and secure transactions for peace of mind." }
]

const testimonials = [
  { name: "Sarah L.", text: "I love how I can make extra money by delivering packages on my way to work!" },
  { name: "John D.", text: "Finding rides in my area has never been easier. Great community feel!" },
  { name: "Emma W.", text: "As a student, this app helps me save money on rides and earn some by delivering." }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-orange-500">CommunityGo</div>
            <div className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-orange-500 transition duration-300">Home</a>
              <a href="#" className="text-gray-600 hover:text-orange-500 transition duration-300">How It Works</a>
              <a href="#" className="text-gray-600 hover:text-orange-500 transition duration-300">About Us</a>
              <a href="#" className="text-gray-600 hover:text-orange-500 transition duration-300">Contact</a>
            </div>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
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
            <div className="space-x-4">
              <button className="bg-orange-500 text-white font-bold py-3 px-8 rounded-full text-lg inline-flex items-center transition duration-300 ease-in-out hover:bg-orange-600 hover:scale-105 transform">
                Start Delivering
                <Package className="ml-2" size={24} />
              </button>
              <button className="bg-white text-orange-500 font-bold py-3 px-8 rounded-full text-lg inline-flex items-center transition duration-300 ease-in-out hover:bg-gray-100 hover:scale-105 transform">
                Find a Ride
                <Car className="ml-2" size={24} />
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How CommunityGo Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-8 text-center transition duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                  <feature.icon className="mx-auto text-orange-500 mb-6" size={56} />
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-orange-100 py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Community Voices</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-8 transition duration-300 ease-in-out hover:shadow-xl">
                  <div className="flex items-center mb-6">
                    <Users className="text-orange-500 mr-2" size={24} />
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                  </div>
                  <p className="text-gray-600 mb-6 text-lg italic">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="bg-gray-800 text-white py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6">Join Your Local CommunityGo Network</h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto">
              Whether you're looking to earn extra income, save on transportation, or just help out your neighbors, 
              CommunityGo has something for everyone. Sign up today and be part of the sharing revolution!
            </p>
            <div className="space-x-6">
              <button className="bg-orange-500 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out hover:bg-orange-600 hover:scale-105 transform">
                Sign Up Now
              </button>
              <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out hover:bg-white hover:text-gray-800 hover:scale-105 transform">
                Learn More
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <p className="text-2xl font-bold text-orange-500">CommunityGo</p>
              <p className="mt-2 text-sm text-gray-400">Empowering communities through shared resources.</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition duration-300">About Us</a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition duration-300">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition duration-300">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition duration-300">Contact Us</a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400 text-sm">
            &copy; 2023 CommunityGo. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

