import React from 'react';
import styles from './DetailCard.module.css'

function DetailCard(props) {
    return <div className={styles.main_card}>
        <h3 className={styles.title}>{props.title}</h3>
        <h2 className={styles.value}>{props.value}</h2>
    </div>;
}

export default DetailCard
