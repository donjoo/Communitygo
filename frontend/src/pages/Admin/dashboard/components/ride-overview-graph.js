"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import adminAxiosInstance from "../../../../adminaxiosconfig"
import { useEffect, useState } from "react";



export function RideOverviewGraph() {


  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRideStats = async () => {
      try {
        const response = await adminAxiosInstance.get('/dashboard/ride_overview/'); // Update API endpoint as needed
        setData(response.data); // Axios automatically parses JSON
      } catch (error) {
        setError(error.message || "Failed to fetch ride stats");
      } finally {
        setLoading(false);
      }
    };

    fetchRideStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;




  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />SS
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="completed" stroke="#8884d8" name="Completed Rides" />
        <Line type="monotone" dataKey="canceled" stroke="#82ca9d" name="Canceled Rides" />
      </LineChart>
    </ResponsiveContainer>
  )
}

