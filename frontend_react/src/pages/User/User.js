import React, { useState, useEffect } from 'react';
import styles from './user.module.css';
import { Card, Button } from 'react-bootstrap';
import Twitter from '@material-ui/icons/Twitter';
import BarChart from '../../components/BarChart/BarChart';
import { ToastContainer, toast } from 'react-toastify';
import { getuserTweets } from '../../api';
import CounterCard from '../../components/CounterCard/CounterCard';
import NewTweetCard from '../../components/NewTweetCard/NewTweetCard';
import moment from 'moment';

function User() {
  const [handle, sethandle] = useState('');
  const [searchresult, setresult] = useState([]);
  const [stats, setstats] = useState([0, 0, 0]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    let positive = searchresult.filter(
      (i) => i.Sentiment === 'Positive'
    ).length;
    let negative = searchresult.filter(
      (i) => i.Sentiment === 'Negative'
    ).length;
    let neutral = searchresult.filter((i) => i.Sentiment === 'Neutral').length;
    setstats([positive, negative, neutral]);
  }, [searchresult]);

  const searchHandler = async () => {
    setloading(true);
    if (handle.trim() === '') {
      toast.error(`Please type something !`);
      setloading(false);
      return;
    } else {
      try {
        const res = await getuserTweets(handle);
        setresult(res.data);
        setloading(false);
      } catch (err) {
        console.log(err);
        toast.error(`500 Internal Error`);
        setloading(false);
      }
    }
  };

  return (
    <div className={styles.user_conatiner}>
      <ToastContainer position="top-center" />
      <div className={styles.search_cont}>
        <Card className={styles.form}>
          <Twitter style={{ color: '#1DA1F2' }} />
          <input
            className={styles.input}
            type="text"
            value={handle}
            onChange={(e) => sethandle(e.target.value)}
            placeholder="Type twitter handle"
          />
          {loading ? (
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'white' }}>
              Loading...
            </h3>
          ) : (
            <Button onClick={searchHandler}>Search</Button>
          )}
        </Card>
      </div>
      <div className={styles.result_cont}>
        <div className={styles.chart_cont}>
          <div className={styles.donut}>
            <BarChart data={stats} />
          </div>
          <CounterCard title="Total" count={stats[0] + stats[1] + stats[2]} />
          <CounterCard title="Positive" count={stats[0]} />
          <CounterCard title="Negative" count={stats[1]} />
        </div>
        <div className={styles.tweetlist}>
          <div className={styles.tweetscroll}>
            {searchresult.map((i) => (
              <NewTweetCard
                user
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
        </div>
      </div>
    </div>
  );
}

export default User;
