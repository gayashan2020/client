import React from "react";
import styles from "../../styles/learningSection.module.css";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { routes } from "@/assets/constants/routeConstants";

export const LearningSection = () => {
  const router = useRouter();
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionHeading}>Automated ePortfolio Management</h2>
      <ul className={styles.bulletPoints}>
        <li>Access a wide range of features to build and</li>
        <li>manage your portfolio including reflective logs,</li>
        <li>inbuilt dedicated messaging app,</li>
        <li>activity verification and point tracking,</li>
        <li>automated portfolio generation and many more...</li>
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
          Access all these features totally free by registering now.
        </p>
        {/* <ul className={styles.bulletPoints}>
          <li>Access a wide range of courses tailored to your needs</li>
          <li>Learn from industry experts and thought leaders</li>
          <li>Track your progress and earn certifications</li>
        </ul> */}
        <Button className={styles.exploreButton} variant="contained" onClick={()=>{router.push(routes.REGISTER)}}>
          Sign up now
        </Button>
      </div>
    </section>
  );
};
