import {configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import rideReducer from './ride/rideslice';
const store = configureStore({
    reducer:{
        auth:authReducer,
        ride:rideReducer,
    }
})



export default store;