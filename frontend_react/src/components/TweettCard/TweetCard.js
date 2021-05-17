import React from 'react';
import styles from './TweetCard.module.css';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { ShareButtons, ShareCounts, generateShareIcon } from 'react-share';

import {
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  LinkedinIcon,
} from 'react-share';

function TweetCard(props) {
  const url = `https://twitter.com/${props.user_id}/status/${props.tweet_id}`;


  return (
    <div
    style={{width : `${props.width}`}}
      className={
        props.positive ? styles.tweetcard_positive : styles.tweetcard_negative
      }
    >
      <div className={styles.header}>
        <div className={styles.sub_header}>
          {props.profile_icon ? (
            <img src={props.profile_icon} className={styles.icon} />
          ) : (
            <TwitterIcon size={30} round />
          )}

          <h1 className={styles.name}>{props.name}</h1>
        </div>
        <h4 className={styles.date}>{props.date}</h4>
      </div>
      <p className={styles.text}>{props.text}</p>
      {props.location ? (
        <div className={styles.sub_header_loc}>
          <div>
            <LocationOnIcon fontSize="small" />
          </div>
          <h4 className={styles.location}>{props.location}</h4>
        </div>
      ) : null}
      <div>
        {' '}
        <WhatsappShareButton
          style={{ marginLeft: '0.5rem', marginRight: '0.5rem' }}
          url={url}
        >
          <WhatsappIcon size={35} round />
        </WhatsappShareButton>
        <TwitterShareButton
          style={{ marginLeft: '0.5rem', marginRight: '0.5rem' }}
          url={url}
        >
          <TwitterIcon size={35} round />{' '}
        </TwitterShareButton>
        <LinkedinShareButton
          style={{ marginLeft: '0.5rem', marginRight: '0.5rem' }}
          url={url}
        >
          <LinkedinIcon size={35} round />
        </LinkedinShareButton>
      </div>
    </div>
  );
}

export default TweetCard;
