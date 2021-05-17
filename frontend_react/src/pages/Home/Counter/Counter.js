import React from 'react';
import styles from './Counter.module.css';

function Counter(props) {
  return (
    <div className={styles.counter}>
      <h2 className={styles.header}>{props.header}</h2>
      <h1 className={styles.text}>
        {props.header} tweets analysed = {props.total}
      </h1>
      {props.totalcounter ? null : (
        <h1 className={styles.percentage}>{props.percentage}%</h1>
      )}
    </div>
  );
}

export default Counter;
