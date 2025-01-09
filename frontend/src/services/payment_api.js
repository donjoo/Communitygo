// import axios from 'axios';
import api from '../api';



// const api = axios.create({
//   baseURL: 'http://localhost:8000/api/',
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// // Add auth token to requests
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export const paymentApi = {
  createOrder: async (data) => {
    const response = await api.post('payments/create_order/', data);
    return response.data;
  },
  
  verifyPayment: async (data) => {
    const response = await api.post('payments/verify_payment/', data);
    return response.data;
  },
  
  completeDelivery: async (deliveryId) => {
    const response = await api.post('payments/complete_delivery/', { delivery_id: deliveryId });
    return response.data;
  },
  
  completeRide: async (rideId) => {
    const response = await api.post('payments/complete_ride/', { ride_id: rideId });
    return response.data;
  },
  
  getWalletBalance: async () => {
    const response = await api.get('wallet/balance/');
    return response.data;
  },
  
  getTransactions: async (page = 1) => {
    const response = await api.get(`payments/transactions/?page=${page}`);
    return response.data;
  }
};