import React, { useState, useEffect } from 'react';
import styles from './NewLineChart.module.css';
import Chart from 'react-apexcharts';

function NewLineChart(props) {
  const [labels, setlabels] = useState([]);
  const [polarity, setpolarity] = useState([]);
  const [subjectivity, setsubjectivity] = useState([]);
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
      categories: labels,
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
      data: polarity,
    },
    {
      name: 'Sentiment',
      data: subjectivity,
    },
  ]);

  console.log(labels);

  useEffect(() => {
    if (props.data.length > 0) {
      let oldlabels = labels;
      let oldpolarityvalues = polarity;
      let oldsubjectivityvalue = subjectivity;
      if (oldlabels.length > 5) {
        oldpolarityvalues.shift();
        oldsubjectivityvalue.shift();
        oldlabels.shift();
      }
      oldlabels.push(props.data[0].created_at.split(' ')[1]);
      oldpolarityvalues.push(props.data[0].polarity);
      oldsubjectivityvalue.push(props.data[0].subjectivity);

      setlabels(oldlabels);
      setpolarity(oldpolarityvalues);
      setsubjectivity(oldsubjectivityvalue);

      const newOptions = {
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
          categories: labels,
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
      };

      const newdata = [
        {
          name: 'Polarity',
          data: polarity,
        },
        {
          name: 'Sentiment',
          data: subjectivity,
        },
      ];

      setoptions(newOptions);
      setdata(newdata);
    }
  }, [props.data]);

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
