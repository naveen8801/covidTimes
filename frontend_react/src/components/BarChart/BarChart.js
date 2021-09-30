import React, { useEffect, useState } from 'react';
import styles from './BarChart.module.css';
import Chart from 'react-apexcharts';

function BarChart() {
  const options = {
    chart: {
      type: 'donut',
    },
    dataLabels: {
      enabled: false,
      style: {
        fontSize: '10px',
        fontColor: 'white',
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },

    labels: ['Positve', 'Negative', 'Neutral'],
    legend: {
      position: 'top',
      fontSize: '10px',
      color: 'white',
      labels: {
        colors: 'white',
      },
      markers: {
        width: 12,
        height: 12,
        fillColors: ['#2D46B9', '#66DE93', '#DBF6E9'],
      },
    },
    fill: {
      opacity: 1,
      colors: ['#2D46B9', '#66DE93', '#DBF6E9'],
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
  };

  const [chartdata, setchartdata] = useState([400, 430, 448]);
  return (
    <div className={styles.chartstyles}>
      <Chart
        width="100%"
        height="100%"
        options={options}
        series={chartdata}
        type="donut"
      />
    </div>
  );
}

export default BarChart;
