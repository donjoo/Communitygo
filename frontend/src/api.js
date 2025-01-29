import axios from "axios"
import { ACCESS_TOKEN } from "./constants"




const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    // baseURL: "http://192.168.26.202:8000/api/",

})


api.interceptors.request.use(

    (config) => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        console.log('tokn', token)
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("REFRESH_TOKEN");

            if (refreshToken) {
                try {
                    const response = await axios.post(
                        `${process.env.REACT_APP_API_BASE_URL}token/refresh/`,
                        { refresh: refreshToken }
                    );
                    const newAccessToken = response.data.access;

                    localStorage.setItem("ACCESS_TOKEN", newAccessToken);
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                    return api(originalRequest);
                } catch (refreshError) {
                    if (refreshError.response?.status === 401) {
                        // Redirect to login page after clearing tokens
                        localStorage.clear();
                        window.location.href = "/login";
                    }
                    console.error("Token refresh failed:", refreshError);
                    // Handle refresh failure (e.g., logout user)
                }
            }
        }
        return Promise.reject(error);
    }
);


export default api
