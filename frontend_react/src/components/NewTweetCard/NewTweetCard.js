import React from 'react';
import styles from './NewtweetCard.module.css';
import { Card, Button } from 'react-bootstrap';
import { style } from 'dom-helpers';
import LocationOn from '@material-ui/icons/LocationOn';

function NewTweetCard(props) {
  const checkSentiment = (sentiment) => {
    if (sentiment === 'Positive') {
      return '#B1E693';
    } else if (sentiment === 'Negative') {
      return '#FE8F8F';
    } else {
      return '#3F5468';
    }
  };
  return (
    <Card className={props.user ? styles.extra : styles.tweetcardcont}>
      <div className={styles.flexBox}>
        <div className={styles.flexbox1}>
          <img src={props.img} className={styles.img} alt="user-logo" />
          <h5 className={styles.name}>{props.name}</h5>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <p className={styles.time}>
            <em>{props.time}</em>
          </p>
        </div>
      </div>
      <div className={styles.textdiv}>
        <p className={styles.text}>{props.text}</p>
      </div>
      <div className={styles.bottomflex}>
        <div
          style={{ backgroundColor: checkSentiment(props.sentiment) }}
          className={styles.sent_div}
        >
          <h6 className={styles.sentimenttext}>{props.sentiment}</h6>
        </div>
        {props.location !== null ? (
          <div className={styles.loc_div}>
            <p style={{ fontSize: '12px', margin: '0px' }}>
              {props.location}
              <LocationOn />
            </p>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

export default NewTweetCard;
