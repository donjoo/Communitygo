import React, { useState } from 'react';
import api from '../../api';
import { resolvePath, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const PhoneNumberInput = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user)

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await api.post('addphonenumber/', { email: user.email, phone_number: phoneNumber }, // Correct object format
            {
                headers: {
                    'Content-Type': 'application/json', // Ensure proper header
                },
            });
        if (response.data.status == 200) {
            navigate('/',{replace:true})
        } else {
            console.log('some error occured')
        }
    };


    

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form 
                onSubmit={handleSubmit} 
                className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg"
            >
                <div className="mb-4">
                    <label 
                        htmlFor="phoneNumber" 
                        className="block text-sm font-medium text-gray-700"
                    >
                        Phone Number:
                    </label>
                    <input
                        id="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        className="mt-1 block w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <button 
                    type="submit"
                    className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default PhoneNumberInput;
