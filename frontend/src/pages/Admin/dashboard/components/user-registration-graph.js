"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { name: 'Jan', users: 400 },
  { name: 'Feb', users: 300 },
  { name: 'Mar', users: 200 },
  { name: 'Apr', users: 278 },
  { name: 'May', users: 189 },
  { name: 'Jun', users: 239 },
  { name: 'Jul', users: 349 },
]

export function UserRegistrationGraph() {
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

