import React, { useState, useEffect } from 'react';
import { startStream } from '../../api';
import Navbar from '../../components/Navbar/Navbar';
import Tweets from '../../components/tweets/Tweets';
import styles from './home.module.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import socketIOClient, { io } from 'socket.io-client';
import Counter from './Counter/Counter';
import TweetCard from '../../components/TweettCard/TweetCard';
import LineChart from '../../components/LineChart/LineChart';
import TweetDetailCard from '../../components/TweetDetailCard/TweetDetailCard';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NewLineChart from '../../components/NewLineChart/NewLineChart';
import BarChart from '../../components/BarChart/BarChart';
import CounterCard from '../../components/CounterCard/CounterCard';

const ENDPOINT = 'http://127.0.0.1:5000';

function Home() {
  const [tweets, settweets] = useState([]);
  const [loader, setLoader] = useState(false);

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

  return (
    <div className={styles.home_container}>
      <ToastContainer position="bottom-center" />
      <div className={styles.flexitems1}>
        <div className={styles.chartsdiv}>
          <NewLineChart />
        </div>
        <div className={styles.chartsdiv}>
          <BarChart />
        </div>
      </div>
      <div className={styles.flexItemCard}>
        <CounterCard title="Total" count={50} />
        <CounterCard title="Positive" count={23} />
        <CounterCard title="Negative" count={13} />
      </div>
      <div className={styles.flexitems2}>
        <div className={styles.livetweetboard}></div>
      </div>
    </div>
  );
}

export default Home;
