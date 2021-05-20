import { SnackbarContent } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { defaults } from 'react-chartjs-2';
import socketIOClient from 'socket.io-client';

defaults.global.animation = true;
defaults.global.defaultFontColor = 'black';
defaults.global.defaultFontSize = 12;


// const ENDPOINT = 'http://127.0.0.1:5000';
const ENDPOINT = 'https://twitter-covid-sentiments.herokuapp.com';

// const ENDPOINT = 'https://covid19-twitter-analyzer.azurewebsites.net';

function LineChart() {
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
    const socket = socketIOClient(ENDPOINT);
    socket.on('tweet_stream', (data) => {
      var newpolarity = data.polarity;
      var newsubjetivity = data.subjectivity;
      var new_label = data.created_at.split(" ")[1];
      var old_label = labels_;
      var old_polarities = polarityvalues;
      var old_subjectivities = subjectivityvalue;
      if (old_label.length >= 5) {
        old_label.shift();
        old_polarities.shift();
        old_subjectivities.shift();
      }
      old_label.push(new_label);
      old_polarities.push(newpolarity);
      old_subjectivities.push(newsubjetivity);

      const temp = {
        labels: old_label,
        datasets: [
          {
            label: 'Polarity',
            data: old_polarities,
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
            data: old_subjectivities,
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
      console.log(temp);
    });
  }, []);

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
