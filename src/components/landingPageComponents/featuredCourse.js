import React, { useEffect, useState } from 'react';
import { fetchCourses } from "@/services/courses";
import styles from "../../styles/featuredCourse.module.css";
import GlassCard from '../GlassCard';


export const FeaturedCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const getCourses = async () => {
      const response = await fetchCourses();
      const selectedCourses = selectRandomCourses(response, 4);
      setCourses(selectedCourses);
    };

    getCourses();
  }, []);

  const selectRandomCourses = (courses, count) => {
    const shuffled = courses.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  return (
    <section className={styles.featuredCourses}>
      <h2 className={styles.featuredCoursesTitle}>Featured Courses</h2>
      <div className={styles.courseCardsContainer}>
        {courses.map((course) => (
          <GlassCard key={course._id} course={course} />
        ))}
      </div>
    </section>
  );
};
