"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const data = [
  { name: 'Jan', completed: 65, canceled: 12 },
  { name: 'Feb', completed: 59, canceled: 15 },
  { name: 'Mar', completed: 80, canceled: 8 },
  { name: 'Apr', completed: 81, canceled: 10 },
  { name: 'May', completed: 56, canceled: 14 },
  { name: 'Jun', completed: 55, canceled: 11 },
  { name: 'Jul', completed: 40, canceled: 9 },
]

export function DeliveryOverview() {
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

