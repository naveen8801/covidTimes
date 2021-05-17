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

const ENDPOINT = 'http://127.0.0.1:5000';

function Home() {
  const [tweets, settweets] = useState([]);
  const [loader, setLoader] = useState(false);

  const startstream = () => {
    startStream()
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getstreamdata = () => {
    const socket = socketIOClient(ENDPOINT);
    socket.on('tweet_stream', (data) => {
      settweets((tweets) => [...tweets, data]);
    });
  };

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    startstream();
    getstreamdata();
    socket.disconnect();
  }, []);

  window.onbeforeunload = function () {
    console.log('j');
  };

  return (
    <div className={styles.home_container}>
      <div className={styles.data}>
        {tweets.length !== 0 ? (
          tweets.slice(tweets.length - 1, tweets.length).map((item) => {
            return (
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div>
                  <LineChart />
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  key={item.tweet_id}
                >
                  <TweetCard
                    tweet_id={item.tweet_id}
                    user_id={item.user_id}
                    name={item.name}
                    date={item.created_at.split(' ')[0]}
                    location={item.location}
                    text={item.text}
                    profile_icon={item.profileimage}
                    positive={item.Sentiment === 'Positive' ? true : false}
                  />
                  <p
                    style={{
                      color: 'white',
                      fontFamily: 'roboto',
                      fontSize: '15px',
                    }}
                  >
                    * 1 means positive statement and -1 means a negative
                    statement.
                  </p>
                  <br />
                  <p
                    style={{
                      color: 'white',
                      fontFamily: 'roboto',
                      fontSize: '15px',
                    }}
                  >
                    * Subjectivity indeicates it is factuak info or public
                    opinion
                  </p>
                  <TweetDetailCard
                    polarity={item.polarity}
                    subjectivity={item.subjectivity}
                    sentiment={item.Sentiment}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div>
            <CircularProgress />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
