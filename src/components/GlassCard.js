import React from "react";
import styles from "../styles/glassCard.module.css";
import { useRouter } from "next/router";

const GlassCard = ({ course }) => {
  const router = useRouter();
  const normalizeDates = (dates) => {
    // Check if the date string contains "and", "to", or "-"
    if (dates?.includes("and")) {
      return dates?.replace("and", "to");
    } else if (dates?.includes("–")) {
      return dates?.replace("–", "to");
    }
    return dates;
  };

  const navigateToCourse = (course) => {
    router.push(`/admin/courses/${course.category}/${course?._id?course?._id:course?.courseId}`);
  };

  return (
    <div className={styles.nft}  onClick={() => navigateToCourse(course)}>
      <div className={styles.main}>
        <img
          src={course.image || "/static/placeholderImage.webp"}
          alt={course.name}
          className={styles.tokenImage}
        />
        <div className={styles.title}>{course.event}</div>
        <hr />
        <div className={styles.tokenInfo}>
          <div className={styles.price}>
            <ins>Dates:</ins> {normalizeDates(course?.dates)} hrs
          </div>
          <div className={styles.duration}>
            <ins>CPD:</ins> {course.total_cpd_points}
          </div>
        </div>
        <div className={styles.creator}>
          <div className={styles.wrapper}>
            <img src="/images/logo.jpg" alt="author" />
          </div>
          <ins>
            By{" "}
            {course?.organizing_body?.length > 30
              ? `${course?.organizing_body?.substring(0, 30)}...`
              : course?.organizing_body}
          </ins>
        </div>
      </div>
    </div>
  );
};

export default GlassCard;
