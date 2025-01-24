import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setAuthData } from "../../redux/auth/authSlice"
import adminAxiosInstance from "../../adminaxiosconfig"
import { Link } from "react-router-dom"
import { GoogleLogin } from '@react-oauth/google';


const AdminLogin = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error,setError] = useState();
    const [showPassword,setShowPassword] = useState(false);


    const user = useSelector((state) => state.auth.user)

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState)
      };
    

    useEffect(() => {
        if (user && user.is_superuser) {
            navigate('/admin/dashboard');
        }
    }, [user,navigate]);



    const handleAdminLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await adminAxiosInstance.post('admin/token/',{email,password});
            localStorage.setItem('adminToken',response.data.admin_token);
            localStorage.setItem('adminData', JSON.stringify(response.data));
            localStorage.setItem('admin_refresh', response.data.admin_refresh); 

            dispatch(setAuthData(response.data));

            navigate('/dashboard',{replace:true});
        } catch (error) {
            console.error('Admin login failed:',error)
            setError('Login failed.Please check your credentials.');
        }
    };


const GoogleAuthLogin = async (user_detail) => {
    const formData = {
        client_id:user_detail,
    };
    await adminAxiosInstance
    .post("authgoogleadmin/",formData)
    .then((response) => {
        localStorage.setItem('adminToken',response.data.admin_token);
        localStorage.setItem('adminData', JSON.stringify(response.data));
        dispatch(setAuthData(response.data));
        navigate('/dashboard',{replace:true});
       
    })
    .catch((err) => {
        console.error('Admin login failed:',error)
        console.log(err);
    })
    }


    return(


        <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col justify-center items-center mb-6">
            <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4 rounded-full shadow-lg">
                Admin Login
            </h2>
        </div>
            <form onSubmit={handleAdminLogin}>
                <div className="mb-4">
                    <input 
                        type="text" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-6 relative">
                <input
                      type={showPassword ? "text" : "password"} // Toggle input type
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                     <span
                        onClick={togglePasswordVisibility} // Toggle password visibility
                        className="absolute top-2 right-2 cursor-pointer text-gray-500"
                    >
                        {showPassword ? "🙈" : "👁️"} {/* Change the icon based on visibility */}
                    </span>
                </div>
                <button 
                    type="submit" 
                    className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    LOGIN
                </button>
            </form>


            <div className='flex px-5 justify-center w-auto py-3'>
          <GoogleLogin 
            onSuccess={(credentialResponse) => {
              GoogleAuthLogin(credentialResponse.credential); 
            }}
            onError={() => {
            console.log("Login Failed");
            }}
          />
        </div>
            {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Switch to User? 
                    <Link to="/login" className="text-blue-500 hover:underline">User-Login</Link>
                </p>
            </div>
        </div>
    </div>
    )


}


export default AdminLogin