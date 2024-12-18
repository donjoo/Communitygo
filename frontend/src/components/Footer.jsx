import React from 'react'

function Footer() {
  return (
    <div className='mt-auto w-full'>
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

export default Footer
