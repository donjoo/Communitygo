import axios from "axios"
import { ACCESS_TOKEN } from "./constants"




const api = axios.create({
    baseURL: "http://localhost:8000/api/",
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



export default api
