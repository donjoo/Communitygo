import React from 'react'

const WORKINGOUT = () => {
  return (
    <section className='relative h-screen flex items-center'>
        <div 
        className='absolute inset-0 bg-cover bg-center bg-no-repeat'
        style={{backgrouImage: "url('/placeholder.svg?height=1080&width=1920&text=Community+Delivery+and+Ride-Sharing')"}}></div>
        <div className='absolute inset-0 bg-black opacity-50'></div>
        <div className='relative container mx-auto px-6 text-center text-white x-10'>
            <h1></h1>
        </div>
    </section>
  )
}

export default WORKINGOUT
