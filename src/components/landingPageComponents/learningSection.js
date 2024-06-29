import React from "react";
import styles from "../../styles/learningSection.module.css";
import { Button } from "@mui/material";

export const LearningSection = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionHeading}>Emphasize Continuous Learning</h2>
      <ul className={styles.bulletPoints}>
        <li>Access a wide range of courses tailored to your needs</li>
        <li>Learn from industry experts and thought leaders</li>
        <li>Track your progress and earn certifications</li>
      </ul>
      <div className={styles.videoContainer}>
        <video
          src="/videos/mixkit_flipping_books.mp4"
          autoPlay
          loop
          muted
          className={styles.video}
        ></video>
      </div>
      <div className={styles.sectionContent}>
        <p className={styles.sectionSubheading}>
          Unlock your potential with our comprehensive learning platform.
        </p>
        {/* <ul className={styles.bulletPoints}>
          <li>Access a wide range of courses tailored to your needs</li>
          <li>Learn from industry experts and thought leaders</li>
          <li>Track your progress and earn certifications</li>
        </ul> */}
        <Button className={styles.exploreButton} variant="contained">
          Discover More
        </Button>
      </div>
    </section>
  );
};
