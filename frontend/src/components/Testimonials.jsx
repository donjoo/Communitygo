import React from 'react'
import { ChevronRight, Package, Car, Users, Clock, MapPin, Shield } from 'lucide-react'

const testimonials = [
    { name: "Sarah L.", text: "I love how I can make extra money by delivering packages on my way to work!" },
    { name: "John D.", text: "Finding rides in my area has never been easier. Great community feel!" },
    { name: "Emma W.", text: "As a student, this app helps me save money on rides and earn some by delivering." }
  ]


const Testimonials = () => {
  return (
    <div>
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
    </div>
  )
}

export default Testimonials
