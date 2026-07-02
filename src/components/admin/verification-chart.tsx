// components/admin/verification-chart.tsx
'use client'

import { useState } from 'react'
import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export function VerificationChart() {
  const [chartData] = useState({
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        label: 'Verification Status',
        data: [33, 12, 0],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)', // Green
          'rgba(245, 158, 11, 0.8)', // Yellow/Orange
          'rgba(239, 68, 68, 0.8)',  // Red
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  })

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  }

  return (
    <div className="h-64 w-full flex items-center justify-center">
      <Pie options={options} data={chartData} />
    </div>
  )
}
