import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

const FeedbackChart = () => {
  const chartRef = useRef(null)

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d')
    
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [{
          data: [65, 20, 15],
          backgroundColor: [
            '#10B981',
            '#F59E0B',
            '#EF4444'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 20,
              color: '#6B7280',
              font: {
                family: 'Inter, sans-serif'
              }
            }
          }
        }
      }
    })

    return () => chart.destroy()
  }, [])

  return (
    <div className="h-64">
      <canvas ref={chartRef} />
    </div>
  )
}

export default FeedbackChart