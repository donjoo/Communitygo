import React from 'react'
import { ChevronRight, Package, Car, Users, Clock, MapPin, Shield } from 'lucide-react'
import { CheckCircleIcon, TruckIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { Button } from "../component/ui/button"; // Adjust based on your project structure

// const testimonials = [
//     { name: "Sarah L.", text: "I love how I can make extra money by delivering packages on my way to work!" },
//     { name: "John D.", text: "Finding rides in my area has never been easier. Great community feel!" },
//     { name: "Emma W.", text: "As a student, this app helps me save money on rides and earn some by delivering." }
//   ]


const Testimonials = () => {

  const steps = [
    {
      icon: <UserGroupIcon className="h-10 w-10 text-blue-500" />,
      title: "Sign Up",
      description: "Create an account to get started. It’s quick and easy!",
    },
    {
      icon: <TruckIcon className="h-10 w-10 text-green-500" />,
      title: "Post or Join Rides",
      description:
        "Looking for a ride? Post your requirements, or join a ride heading your way.",
    },
    {
      icon: <CheckCircleIcon className="h-10 w-10 text-yellow-500" />,
      title: "Confirm & Enjoy",
      description: "Confirm your ride or delivery, sit back, and enjoy the journey!",
    },
  ]
  return (













    <div className="flex flex-col items-center py-16 bg-gray-50">
    <div className="max-w-4xl text-center">
      <h1 className="text-4xl font-bold text-orange-600">How It Works</h1>
      <p className="text-lg text-gray-700 mt-4">
        Our platform makes ridesharing and deliveries easier than ever. Here's how to get started:
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 max-w-6xl">
      {steps.map((step, index) => (
        <div
          key={index}
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md"
        >
          <div className="mb-4">{step.icon}</div>
          <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
          <p className="text-gray-600 mt-2 text-center">{step.description}</p>
        </div>
      ))}
    </div>

    <Button
      className="mt-10 px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-blue-700"
      href="/get-started"
    >
      Get Started
    </Button>
  </div>









    // <div>
    //   <section className="bg-orange-100 py-20">
    //       <div className="container mx-auto px-6">
    //         <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Community Voices</h2>
    //         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
    //           {testimonials.map((testimonial, index) => (
    //             <div key={index} className="bg-white rounded-lg shadow-lg p-8 transition duration-300 ease-in-out hover:shadow-xl">
    //               <div className="flex items-center mb-6">
    //                 <Users className="text-orange-500 mr-2" size={24} />
    //                 <p className="font-semibold text-gray-800">{testimonial.name}</p>
    //               </div>
    //               <p className="text-gray-600 mb-6 text-lg italic">"{testimonial.text}"</p>
    //             </div>
    //           ))}
    //         </div>
    //       </div>
    //     </section>
    // </div>
  )
}

export default Testimonials
