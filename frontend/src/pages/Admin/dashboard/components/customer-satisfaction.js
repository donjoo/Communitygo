"use client"

import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const data = {
  labels: ['Very Satisfied', 'Satisfied', 'Neutral', 'Unsatisfied', 'Very Unsatisfied'],
  datasets: [
    {
      data: [50, 30, 10, 7, 3],
      backgroundColor: [
        '#4CAF50',
        '#8BC34A',
        '#FFC107',
        '#FF9800',
        '#F44336',
      ],
      hoverBackgroundColor: [
        '#45a049',
        '#7cb342',
        '#ffb300',
        '#fb8c00',
        '#e53935',
      ],
    },
  ],
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
    },
  },
}

export function CustomerSatisfaction() {
  return (
    <div className="h-[300px] w-full">
      <Doughnut data={data} options={options} />
    </div>
  )
}

