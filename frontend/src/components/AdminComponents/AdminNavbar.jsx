import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthData } from '../../redux/auth/authSlice';
import Logout from '../Logout';



function AdminNavbar() {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
      console.log('loggedout')
      localStorage.removeItem('adminToken');
      console.log('loggedodqwefewfut')

      localStorage.removeItem('adminData');
      console.log('loggedoutefg4egf')

      navigate('/login');

  };



    useEffect(() => {
      if (!user) {
        const storedUserData = localStorage.getItem('adminData');
        if (storedUserData) {
          const parsedAdminData = JSON.parse(storedUserData);
          if (parsedAdminData?.user) {
            dispatch(setAuthData({ user: parsedAdminData.user})); // Dispatch user data to the Redux store
          }
        }
      }
    }, [dispatch, navigate, user]);
  
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold text-orange-500">
        <h2 onClick={()=> navigate('/dashboard')} className="text-xl font-semibold text-gray-800 cursor-pointer">Dashboard</h2>
        </div>
        <div className="hidden md:flex space-x-6">
          <NavLink to="/usermanagement" className="text-gray-600 hover:text-orange-500 transition duration-300">Usermanagement</NavLink>
          <a href="/deliverymanagement" className="text-gray-600 hover:text-orange-500 transition duration-300">Delivery management</a>
          { user ? (
            <>
          <NavLink to='#' className="text-orange-500 hover:underline">{user.username}</NavLink>
          <NavLink to='/login' className="text-blue-500 hover:underline">
               LogOut
          </NavLink>

          </>
          ):(
            <>
    {/* <NavLink to="/register" className="text-blue-500 hover:underline">Signup</NavLink> */}
    <NavLink to="/login" className="text-blue-500 hover:underline">Login</NavLink>
          </>
        )}
        </div>
      </div>
    </nav>
  </header>

 

  )
}

export default AdminNavbar
