import { LogIn } from 'lucide-react'
import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { clearAuthData } from '../redux/auth/authSlice';


const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  // Handle the logout logic and redirection
  const handleLogout = () => {
    localStorage.clear(); 
    dispatch(clearAuthData())
    console.log('Logging out....');// Clear local storage
    navigate('/login');   // Redirect to the login page
  };

  React.useEffect(() => {
    handleLogout(); // Call handleLogout on mount
  }, [navigate]);

  return null; // This component doesn't need to render anything
};

export default Logout;
