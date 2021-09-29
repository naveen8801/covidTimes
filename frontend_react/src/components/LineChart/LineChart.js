import { SnackbarContent } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { defaults } from 'react-chartjs-2';
import socketIOClient from 'socket.io-client';

defaults.global.animation = true;
defaults.global.defaultFontColor = 'black';
defaults.global.defaultFontSize = 12;

const ENDPOINT = 'http://127.0.0.1:5000';

// const ENDPOINT = 'https://covid19-twitter-analyzer.azurewebsites.net';

function LineChart(props) {
  const [sno, setsno] = useState(1);
  const [labels_, setlabels] = useState([]);
  const [polarityvalues, setpolarityvalues] = useState([]);
  const [subjectivityvalue, setsubjectivityvalue] = useState([]);
  const [data, setdata] = useState({
    labels: [],
    datasets: [
      {
        label: 'Polarity',
        data: [],
        fill: false,
        lineTension: 0.5,
        backgroundColor: '#f21170',
        borderColor: '#f21170',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 0,
        pointHitRadius: 10,
        borderWidth: 4,
      },
      {
        label: 'Subjectivity',
        data: [],
        fill: false,
        lineTension: 0.5,
        backgroundColor: '#511281',
        borderColor: '#511281',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 0,
        pointHitRadius: 10,
        borderWidth: 4,
      },
    ],
  });

  useEffect(() => {
    if (props.tweets.length > 0) {
      let oldlabels = labels_;
      let oldpolarityvalues = polarityvalues;
      let oldsubjectivityvalue = subjectivityvalue;
      if (oldlabels.length > 10 && oldlabels.length > 5) {
        oldpolarityvalues.shift();
        oldsubjectivityvalue.shift();
        oldlabels.shift();
      }
      oldlabels.push(props.tweets[0].created_at.split(' ')[1]);
      oldpolarityvalues.push(props.tweets[0].polarity);
      oldsubjectivityvalue.push(props.tweets[0].subjectivity);

      const temp = {
        labels: oldlabels,
        datasets: [
          {
            label: 'Polarity',
            data: oldpolarityvalues,
            fill: false,
            lineTension: 0.2,
            backgroundColor: '#f21170',
            borderColor: '#f21170',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 0,
            pointHitRadius: 10,
            borderWidth: 4,
          },
          {
            label: 'Subjectivity',
            data: oldsubjectivityvalue,
            fill: false,
            lineTension: 0.2,
            backgroundColor: '#511281',
            borderColor: '#511281',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 0,
            pointHitRadius: 10,
            borderWidth: 4,
          },
        ],
      };
      setdata(temp);
    }
  }, [props]);

  return (
    <div
      style={{
        backgroundColor: 'black',
        width: '660px',
        height: '580px',
        padding: '0.5rem',
        borderStyle: 'none',
        margin: '1rem',
        borderRadius: '12px',
        boxShadow:
          'rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset',
      }}
    >
      <Line
        data={data}
        width={50}
        height={40}
        options={{
          maintainAspectRatio: true,
        }}
        redraw
      />
    </div>
  );
}

export default LineChart;
