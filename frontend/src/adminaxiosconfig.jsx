import axios from 'axios';


const adminAxiosInstance = axios.create({
    baseURL: 'http://localhost:8000/admin/'
});

adminAxiosInstance.interceptors.request.use(
    (config) => {
        const adminToken = localStorage.getItem('adminToken');
        if (adminToken) {
            config.headers['Authorization'] = `Bearer ${adminToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);  

adminAxiosInstance.interceptors.response.use(
    (response) => response,  // If the response is successful, just return it
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = localStorage.getItem('refresh');
          const refreshResponse = await axios.post('http://localhost:8000/admin/token/refresh/', {
            refresh: refreshToken,
          });
          // Store the new admin token
          localStorage.setItem('adminToken', refreshResponse.data.access);
          originalRequest.headers['Authorization'] = `Bearer ${refreshResponse.data.access}`;
          return adminAxiosInstance(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Log out the admin if the refresh fails
          localStorage.clear();
          window.location.href = '/admin-login';
        }
      }
      return Promise.reject(error);
    }
  );



// adminAxiosInstance.interceptors.request.use((config) => {
//     const token = localStorage.getItem('adminToken');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//     },
// (error) => Promise.reject(error)
// );



export default adminAxiosInstance