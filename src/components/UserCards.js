// src/components/UserCards.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import styles from "../styles/Dashboard.module.css";
import { userRoles } from '@/assets/constants/authConstants';

const UserCards = ({ onlineUserCountByRole, user, coursesCount }) => {
  return (
    <div className={styles.cards}>
      <div className={styles.card}>
        <p className={styles.roleName}>Mentors</p>
        <p className={styles.roleCount}>
          {onlineUserCountByRole.mentor || 0}
        </p>
      </div>
      <div className={styles.card}>
        <p className={styles.roleName}>Students</p>
        <p className={styles.roleCount}>
          {onlineUserCountByRole.student || 0}
        </p>
      </div>
      <div className={styles.card}>
        <p className={styles.roleName}>Admins</p>
        <p className={styles.roleCount}>
          {onlineUserCountByRole.admin || 0}
        </p>
      </div>
      <div className={styles.card}>
        <p className={styles.roleName}>CPD Providers</p>
        <p className={styles.roleCount}>
          {onlineUserCountByRole.cpd_provider || 0}
        </p>
      </div>
      {user?.role && user?.role === userRoles.STUDENT && (
        <>
          <div className={styles.card}>
            <p className={styles.roleName}>Total Approved Courses</p>
            <p className={styles.roleCount}>
              {coursesCount.totalApprovedCourses}
            </p>
          </div>
          <div className={styles.card}>
            <p className={styles.roleName}>Total Enrolled Courses</p>
            <p className={styles.roleCount}>
              {coursesCount.totalEnrolledCourses}
            </p>
          </div>
        </>
      )}
      {user?.role &&
        (user?.role === userRoles.SUPER_ADMIN ||
          user?.role === userRoles.ADMIN) && (
          <>
            <div className={styles.card}>
              <p className={styles.roleName}>Total Courses</p>
              <p className={styles.roleCount}>{coursesCount?.length}</p>
            </div>
          </>
        )}
    </div>
  );
};

export default UserCards;
