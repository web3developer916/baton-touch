import React, { useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Chart.jsの設定を登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const GrowthChart = ({ records }) => {
  const [activeChart, setActiveChart] = useState('height')

  // ダミーデータの標準値
  const standardData = {
    height: [
      { month: 0, value: 50 },
      { month: 1, value: 54 },
      { month: 2, value: 58 },
      { month: 3, value: 61 },
      { month: 4, value: 63 },
      { month: 5, value: 65 },
      { month: 6, value: 67 },
      { month: 7, value: 69 },
      { month: 8, value: 71 },
      { month: 9, value: 72 },
      { month: 10, value: 73 },
      { month: 11, value: 74 },
      { month: 12, value: 75 }
    ],
    weight: [
      { month: 0, value: 3.3 },
      { month: 1, value: 4.2 },
      { month: 2, value: 5.1 },
      { month: 3, value: 5.9 },
      { month: 4, value: 6.5 },
      { month: 5, value: 7.0 },
      { month: 6, value: 7.4 },
      { month: 7, value: 7.8 },
      { month: 8, value: 8.1 },
      { month: 9, value: 8.4 },
      { month: 10, value: 8.7 },
      { month: 11, value: 8.9 },
      { month: 12, value: 9.1 }
    ]
  }

  const chartData = {
    labels: records
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(record => {
        const date = new Date(record.date)
        return `${date.getMonth() + 1}/${date.getDate()}`
      }),
    datasets: [
      {
        label: activeChart === 'height' ? '身長 (cm)' : '体重 (kg)',
        data: records
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map(record => activeChart === 'height' ? record.height : record.weight),
        borderColor: '#f97316',
        backgroundColor: '#f97316',
        tension: 0.4
      },
      {
        label: '標準値',
        data: standardData[activeChart].map(d => d.value),
        borderColor: '#94a3b8',
        backgroundColor: '#94a3b8',
        borderDash: [5, 5],
        tension: 0.4
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 40,
        right: 20,
        bottom: 10,
        left: 20
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        displayColors: true
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: '#f3f4f6'
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 10
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 10
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  }

  return (
    <div className="relative h-48 w-full">
      <div className="absolute top-2 right-2 z-10 flex space-x-2">
        <button
          onClick={() => setActiveChart('height')}
          className={`px-3 py-1 rounded-full text-sm ${
            activeChart === 'height'
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          身長
        </button>
        <button
          onClick={() => setActiveChart('weight')}
          className={`px-3 py-1 rounded-full text-sm ${
            activeChart === 'weight'
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          体重
        </button>
      </div>
      {chartData && <Line data={chartData} options={chartOptions} />}
    </div>
  )
}

export default GrowthChart