"use client"

import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import adminAxiosInstance from "../../../../adminaxiosconfig"

// const data = [
//   { name: 'Jan', users: 400 },
//   { name: 'Feb', users: 300 },
//   { name: 'Mar', users: 200 },
//   { name: 'Apr', users: 278 },
//   { name: 'May', users: 189 },
//   { name: 'Jun', users: 239 },
//   { name: 'Jul', users: 349 },
// ]

export function UserRegistrationGraph() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserRegistrations = async () => {
      try {
        const response = await adminAxiosInstance.get('/dashboard/user_registrations/');
        setData(response.data); // Axios automatically parses JSON
      } catch (error) {
        setError(error.message || 'An error occurred while fetching user registrations');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRegistrations();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;


  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="users" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  )
}

