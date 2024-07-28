import React, { useEffect } from "react";
import { Button } from "@mui/material";
import styles from "../../styles/heroSection.module.css";
import Image from 'next/image';
import { useRouter } from "next/router";

export const HeroSection = () => {
  const router = useRouter();
  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      const xPos = (clientX / window.innerWidth) * 100;
      const yPos = (clientY / window.innerHeight) * 100;
      const heroContainer = document.querySelector(`.${styles.heroContainer}`);
      if (heroContainer) {
        heroContainer.style.background = `radial-gradient(circle at ${xPos}% ${yPos}%, #2C666E, #161B33)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroContent}>
        <div className={styles.title}>
          Explore tailored <span className={styles.highlight}>Courses</span> to enhance your professional <span className={styles.highlight}>Skills</span>
        </div>
        <div className={styles.subtitle}>
          Discover innovative methods to transform your skills and professional life.
        </div>
        <Button className={styles.exploreButton} variant="contained" onClick={()=>{router.push("/courses")}}>
          Explore our courses →
        </Button>
        <div className={styles.reviews}>
          <span>★★★★★</span> Based on 1,000+ reviews from medical professionals
        </div>
      </div>
      <div className={styles.heroImage}>
        <Image
          src="/images/doctor_holding_a_book.png"
          alt="Doctor holding a book"
          width={600}
          height={600}
        />
      </div>
    </div>
  );
};
