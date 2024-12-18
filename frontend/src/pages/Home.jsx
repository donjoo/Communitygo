import React, { useEffect } from 'react'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
// import Features from '../components/Features'
import Testimonials from '../components/Testimonials'
import Actionfoot from '../components/Actionfoot'
import Footer from '../components/Footer'
import { useSelector ,useDispatch} from 'react-redux'
// import { setAuthData } from '../redux/auth/authSlice'
import { useNavigate } from 'react-router-dom'


const Home = () => {

  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!user) {
  //     const storedUserData = localStorage.getItem('user');
  //     if (storedUserData) {
  //       const parsedUserData = JSON.parse(storedUserData);
  //       dispatch(setAuthData({ user: parsedUserData }));
  //     } 
  //   }
  // }, [dispatch, navigate, user]);


  return (
    <>
    < Navbar />
    < Hero />
    {/* < Features /> */}
    < Testimonials />
    {!user ? (< Actionfoot />):( "")}
    
    < Footer />
    </>
  )
}

export default Home
