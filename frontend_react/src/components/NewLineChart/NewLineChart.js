import React, { useState, useEffect } from 'react';
import styles from './NewLineChart.module.css';
import Chart from 'react-apexcharts';

function NewLineChart() {
  const [options, setoptions] = useState({
    chart: {
      type: 'line',
      zoom: {
        enabled: false,
      },
    },
    legend: {
      fontSize: '10px',
      color: 'white',
      labels: {
        colors: 'white',
      },
      markers: {
        width: 12,
        height: 12,
      },
    },
    stroke: {
      curve: 'straight',
      width: 2,
    },
    title: {
      text: 'Polarity vs Sentiment Per Tweet',
      align: 'center',
      style: {
        fontSize: '12px',
        color: 'white',
      },
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      labels: {
        style: {
          colors: 'white',
          fontSize: '12px',
          fontWeight: 200,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: 'white',
          fontSize: '12px',
          fontWeight: 200,
        },
      },
    },
  });

  const [chartdata, setdata] = useState([
    {
      name: 'Polarity',
      data: [44, 55, 57, 56, 61, 58, 63],
    },
    {
      name: 'Sentiment',
      data: [76, 85, 101, 98, 87, 105, 94],
    },
  ]);

  return (
    <div className={styles.chartstyles}>
      <Chart
        width="100%"
        height="100%"
        options={options}
        series={chartdata}
        type="line"
      />
    </div>
  );
}

export default NewLineChart;
