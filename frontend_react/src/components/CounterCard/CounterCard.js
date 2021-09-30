import React from 'react';
import styles from './CounterCard.module.css';
import { Card } from 'react-bootstrap';

function CounterCard(props) {
  return (
    <Card className={styles.counterCard}>
      <h2 className={styles.titlehead}>{props.title}</h2>
      <h5 className={styles.counthead}>{props.count}</h5>
    </Card>
  );
}

export default CounterCard;
