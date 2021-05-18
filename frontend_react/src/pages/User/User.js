import React, { useState, useEffect } from 'react';
import Form_user from '../../components/Form_user/Form_user';
import styles from './user.module.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getuserTweets } from '../../api';
import { Bar, Line } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import TweetCard from './../../components/TweettCard/TweetCard';
import LineChart from './../../components/LineChart/LineChart';
import { defaults } from 'react-chartjs-2';

defaults.global.animation = true;
defaults.global.defaultFontColor = 'white';
defaults.global.defaultFontSize = 12;

function User() {
  const [show, setshow] = useState(false);
  const [sumbitState, setSumbitState] = useState(false);
  const [chartData, setchartdata] = useState({});
  const [tweetlist, settweetlist] = useState([]);
  const [nameSeacrhing, setname] = useState('');

  const [labels_, setlabels] = useState([]);
  const [polarityvalues, setpolarityvalues] = useState([]);
  const [subjectivityvalue, setsubjectivityvalue] = useState([]);
  const [linechartdata, setlinechartdata] = useState({
    labels: labels_,
    datasets: [
      {
        label: 'Polarity',
        data: polarityvalues,
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
        data: subjectivityvalue,
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

  const sumbitted = async (input) => {
    setshow(false);
    const data = await getuserTweets(input);
    const main_data = data.data;
    var positive_tweets = 0;
    var negative_tweets = 0;
    var _labels = [];
    var _polarities = [];
    var _subjectivities = [];

    for (var i = 0; i < main_data.length; i++) {
      if (main_data[i].Sentiment === 'Positive') {
        positive_tweets++;
      } else {
        negative_tweets++;
      }
      _labels.push(i);
      _polarities.push(main_data[i].Polarity);
      _subjectivities.push(main_data[i].Subjectivity);
    }

    const data_for_chart = {
      labels: ['Positive', 'Negative'],
      datasets: [
        {
          label: 'No. Of Different Tweets',
          data: [positive_tweets, negative_tweets],
          backgroundColor: ['#f21170', '#511281'],
          borderColor: ['rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
        },
      ],
    };

    setchartdata(data_for_chart);
    settweetlist(main_data);
    setname(input);

    const temp = {
      labels: _labels,
      datasets: [
        {
          label: 'Polarity',
          data: _polarities,
          fill: false,
          lineTension: 0.8,
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
          data: _subjectivities,
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

    setlabels(_labels);

    setpolarityvalues(_polarities);
    setsubjectivityvalue(_subjectivities);

    setlinechartdata(temp);
    console.log(linechartdata);
    setSumbitState(false);
    setshow(true);
  };
  return (
    <div className={styles.user_conatiner}>
      <div className={styles.home_text_content}>
        <p className={styles.sub_text}>
          Welcome{' '}
          <strong>
            COVID-19 Sentimental Analysis Of Twitter Social Handle{' '}
          </strong>
          through this page you can easily perform analysis of particular
          twitter handle by inputing username of user
        </p>
        <Form_user sumbitted={sumbitted} />
      </div>
      <hr className={styles.hr_liner}></hr>
      {show ? (
        <div className={styles.main_content}>
          <div>
            <div className={styles.chart}>
              <Pie
                data={chartData}
                height={300}
                width={400}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: true,
                        },
                      },
                    ],
                  },
                }}
              />
            </div>
            <div className={styles.chart}>
              <Bar
                data={chartData}
                height={300}
                width={400}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: true,
                        },
                      },
                    ],
                  },
                }}
              />
            </div>
            <div className={styles.chart}>
              <Line
                data={linechartdata}
                height={300}
                width={400}
                options={{
                  maintainAspectRatio: true,
                }}
                redraw
              />
            </div>
            <div>
              <h2 className={styles.heading}>
                Latest Tweets from {nameSeacrhing}
              </h2>
              {tweetlist.map((tweet) => {
                return (
                  <TweetCard
                    width="400px"
                    key={tweet.tweet_id}
                    tweet_id={tweet.tweet_id}
                    user_id={tweet.user_id}
                    name={tweet.name}
                    date={tweet.created_at.split(' ')[0]}
                    location={tweet.location}
                    text={tweet.text}
                    profile_icon={tweet.profileimage}
                    positive={tweet.Sentiment === 'Positive' ? true : false}
                  />
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
}

export default User;
