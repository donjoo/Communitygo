import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { setAuthData } from '../redux/auth/authSlice';

function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false); // State to manage mobile menu visibility

  useEffect(() => {
    if (!user) {
      const storedUserData = localStorage.getItem('user');
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        dispatch(setAuthData({ user: parsedUserData }));
      } 
    }
  }, [dispatch, navigate, user]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-orange-500">CommunityGo</div>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-600 focus:outline-none">
              {/* Hamburger Icon */}
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
              )}
            </button>
          </div>
          {/* Normal Nav Links */}
          <div className={`hidden md:flex space-x-6`}>
            <NavLink to="/" className="text-gray-600 hover:text-orange-500 transition duration-300">Home</NavLink>
            <a href="#" className="text-gray-600 hover:text-orange-500 transition duration-300">How It Works</a>
            <a href="#" className="text-gray-600 hover:text-orange-500 transition duration-300">About Us</a>
            <a href="#" className="text-gray-600 hover:text-orange-500 transition duration-300">Contact</a>
            {user ? (
              <>
                <NavLink to='/profile' className="text-orange-500 hover:underline">{user.username}</NavLink>
                <NavLink to="/logout" className="text-blue-500 hover:underline">LogOut</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/register" className="text-blue-500 hover:underline">Signup</NavLink>
                <NavLink to="/login" className="text-blue-500 hover:underline">Login</NavLink>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`md:hidden bg-white shadow-md`}>
          <div className={`flex flex-col space-y-2 p-4`}>
            <NavLink to="/" onClick={toggleMenu} className="text-gray-600 hover:text-orange-500 transition duration-300">Home</NavLink>
            <a href="#" onClick={toggleMenu} className="text-gray-600 hover:text-orange-500 transition duration-300">How It Works</a>
            <a href="#" onClick={toggleMenu} className="text-gray-600 hover:text-orange-500 transition duration-300">About Us</a>
            <a href="#" onClick={toggleMenu} className="text-gray-600 hover:text-orange-500 transition duration-300">Contact</a>
            {user ? (
              <>
                <NavLink to='/profile' onClick={toggleMenu} className="text-orange-500 hover:underline">{user.username}</NavLink>
                <NavLink to="/logout" onClick={toggleMenu} className="text-blue-500 hover:underline">LogOut</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/register" onClick={toggleMenu} className="text-blue-500 hover:underline">Signup</NavLink>
                <NavLink to="/login" onClick={toggleMenu} className="text-blue-500 hover:underline">Login</NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
