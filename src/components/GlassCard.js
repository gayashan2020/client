import React from 'react';
import styles from '../styles/glassCard.module.css';

const GlassCard = ({ course }) => {
  return (
    <div className={styles.nft}>
      <div className={styles.main}>
        <img src={course.image} alt={course.name} className={styles.tokenImage} />
        <div className={styles.title}>
          {course.name}
        </div>
        <hr />
        <div className={styles.tokenInfo}>
          <div className={styles.price}>
            <ins>Duration:</ins> {course.duration} hrs
          </div>
          <div className={styles.duration}>
            <ins>CPD:</ins> {course.cpdTotal}
          </div>
        </div>
        <div className={styles.creator}>
          <div className={styles.wrapper}>
            <img src="/images/logo.jpg" alt="author" />
          </div>
          <ins>By {course.authors}</ins>
        </div>
      </div>
    </div>
  );
};

export default GlassCard;
