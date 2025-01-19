"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"

const data = [
  { name: 'Jan', completed: 65, canceled: 12 },
  { name: 'Feb', completed: 59, canceled: 15 },
  { name: 'Mar', completed: 80, canceled: 8 },
  { name: 'Apr', completed: 81, canceled: 10 },
  { name: 'May', completed: 56, canceled: 14 },
  { name: 'Jun', completed: 55, canceled: 11 },
  { name: 'Jul', completed: 40, canceled: 9 },
]

export function RideOverviewGraph() {
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

