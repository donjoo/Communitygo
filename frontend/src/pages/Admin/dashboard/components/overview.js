"use client"

import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import adminAxiosInstance from "../../../../adminaxiosconfig"


export function Overview() {


  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonthlyRevenue = async () => {
      try {
        const response = await adminAxiosInstance.get('/dashboard/monthly_revenue/'); // Update API endpoint as needed
        setData(response.data); // Axios automatically parses JSON
      } catch (error) {
        setError(error.message || "Failed to fetch monthly revenue");
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyRevenue();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value.toFixed(2)}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

