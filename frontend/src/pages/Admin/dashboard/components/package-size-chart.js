"use client"

import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts"
import { useEffect, useState } from "react";
import adminAxiosInstance from "../../../../adminaxiosconfig"


const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

export function PackageSizeChart() {


  const [data, setData] = useState([
    { name: 'Small', value: 0 },
    { name: 'Medium', value: 0 },
    { name: 'Large', value: 0 },
  ]);

  useEffect(() => {
    const fetchPackageSizeData = async () => {
      try {
        const response = await adminAxiosInstance.get('/dashboard/package-size-overview/');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching package size data:', error);
      }
    };

    // Initial fetch
    fetchPackageSizeData();

    // Set an interval to fetch data every 30 seconds for real-time updates
    const interval = setInterval(fetchPackageSizeData, 300000);

    // Cleanup on component unmount
    return () => clearInterval(interval);
  }, []);



  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

