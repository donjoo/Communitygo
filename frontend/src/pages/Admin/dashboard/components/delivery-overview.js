"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { useEffect, useState } from "react";
import adminAxiosInstance from "../../../../adminaxiosconfig"


export function DeliveryOverview() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        const response = await adminAxiosInstance.get('/dashboard/delivery_overview/');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching delivery data:', error);
      }
    };
    
    // Initial fetch
    fetchDeliveryData();

    // Set an interval to fetch data every 30 seconds (for real-time update)
    const interval = setInterval(fetchDeliveryData, 300000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);


  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="completed" fill="#8884d8" name="Completed" />
        <Bar dataKey="canceled" fill="#82ca9d" name="Canceled" />
      </BarChart>
    </ResponsiveContainer>
  )
}

