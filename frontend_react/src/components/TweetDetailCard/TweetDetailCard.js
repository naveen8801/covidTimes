import React from 'react';
import DetailCard from './DetailCard/DetailCard';
import styles from './tweetdetailcard.module.css'

function TweetDetailCard(props) {
    return (
      <div className={styles.main}>
        <div>
          <h2 className={styles.heading}>Current Tweet Details</h2>
        </div>
        <div className={styles.sub}>
          <DetailCard title="Polarity" value={props.polarity} />
          <DetailCard title="Subjectivity" value={props.subjectivity} />
          <DetailCard title="Sentiment" value={props.sentiment} />
        </div>
      </div>
    );
}

export default TweetDetailCard
