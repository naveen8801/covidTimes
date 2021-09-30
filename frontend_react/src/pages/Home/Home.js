import React, { useState, useEffect } from 'react';
import { startStream } from '../../api';
import styles from './home.module.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import socketIOClient from 'socket.io-client';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NewLineChart from '../../components/NewLineChart/NewLineChart';
import BarChart from '../../components/BarChart/BarChart';
import CounterCard from '../../components/CounterCard/CounterCard';
import NewTweetCard from '../../components/NewTweetCard/NewTweetCard';

// const ENDPOINT = 'http://127.0.0.1:5000';
const ENDPOINT = 'https://covid-19-realtime.azurewebsites.net/';

function Home() {
  const [tweets, settweets] = useState([]);
  const [stats, setstats] = useState([0, 0, 0]);

  const socket = socketIOClient(ENDPOINT);

  const startstream = () => {
    startStream()
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        toast.error(`500 Internal Error`);
        console.log(error);
      });
  };

  const getstreamdata = () => {
    socket.on('tweet_stream', (data) => {
      settweets((tweets) => [data, ...tweets]);
    });
  };

  useEffect(() => {
    startstream();
    getstreamdata();
  }, []);

  useEffect(() => {
    let positive = tweets.filter((i) => i.Sentiment === 'Positive').length;
    let negative = tweets.filter((i) => i.Sentiment === 'Negative').length;
    let neutral = tweets.filter((i) => i.Sentiment === 'Neutral').length;
    setstats([positive, negative, neutral]);
  }, [tweets]);

  return (
    <div className={styles.home_container}>
      <ToastContainer position="bottom-center" />
      <div className={styles.flexitems1}>
        {tweets.length > 0 ? (
          <>
            <div className={styles.chartsdiv}>
              <NewLineChart data={tweets} />
            </div>
            <div className={styles.chartsdiv}>
              <BarChart data={stats} />
            </div>
          </>
        ) : (
          <CircularProgress />
        )}
      </div>
      <div className={styles.flexItemCard}>
        {tweets.length > 0 ? (
          <>
            <CounterCard title="Total" count={stats[0] + stats[1] + stats[2]} />
            <CounterCard title="Positive" count={stats[0]} />
            <CounterCard title="Negative" count={stats[1]} />
          </>
        ) : (
          <CircularProgress />
        )}
      </div>
      <div className={styles.flexitems2}>
        {tweets.length > 0 ? (
          <>
            <div className={styles.livetweetboard}>
              {tweets.map((i) => (
                <NewTweetCard
                  key={i.tweet_id}
                  img={i.profileimage}
                  name={i.name}
                  time={moment(i.created_at).fromNow()}
                  text={i.text}
                  sentiment={i.Sentiment}
                  location={i.location}
                />
              ))}
            </div>
          </>
        ) : (
          <CircularProgress />
        )}
      </div>
    </div>
  );
}

export default Home;
