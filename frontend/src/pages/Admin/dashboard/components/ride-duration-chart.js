"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const data = [
  { duration: '0-10', count: 120 },
  { duration: '11-20', count: 200 },
  { duration: '21-30', count: 150 },
  { duration: '31-40', count: 80 },
  { duration: '41-50', count: 40 },
  { duration: '51+', count: 30 },
]

export function RideDurationChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="duration" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" name="Number of Rides" />
      </BarChart>
    </ResponsiveContainer>
  )
}

