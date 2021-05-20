import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import TwitterIcon from '@material-ui/icons/Twitter';
import socketIOClient, { io } from 'socket.io-client';

// const ENDPOINT = 'http://127.0.0.1:5000';
const ENDPOINT = 'https://twitter-covid-sentiments.herokuapp.com';
const socket = socketIOClient(ENDPOINT);

function Navbar() {
  return (
    <div className={styles.navbar_container}>
      <div className={styles.links_conatiner}>
        <ul className={styles.ul_links}>
          <li className={styles.li_link_title}>covidTimes</li>
          <Link to="/" style={{ textDecoration: 'None' }}>
            <li className={styles.li_link}>Live Twitter Analysis</li>
          </Link>
          <Link to="/user_analysis" style={{ textDecoration: 'None' }}>
            <li
              className={styles.li_link}
              onClick={() => {
                socket.emit('disconnecting_me', { username: 'I AM GONE' });
              }}
            >
              User Analysis
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
