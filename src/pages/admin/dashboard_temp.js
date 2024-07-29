// pages/admin/dashboard.js
import styles from "../../styles/Dashboard.module.css";
import { Box, Card, Typography } from "@mui/material";
import Layout from "../../components/Layout";
import { useEffect, useState, useContext } from "react";
import { fetchCurrentUser } from "@/services/users";
import { LoadingContext } from "@/contexts/LoadingContext";
import { useRouter } from "next/router";
import { routes } from "@/assets/constants/routeConstants";
import { userRoles } from "@/assets/constants/authConstants";
import CourseCard from "@/components/CourseCard"; // Import CourseCard component
import {
  getUserData,
  getUserCount,
  getUserCoursesCount,
} from "@/services/dashboard";
import { fetchMentorByCurrentUser } from "@/services/mentorService";
import { getSettingByID } from "@/services/setting";
import AvatarBox from "@/components/AvatarBox";
import CPDCard from "@/components/CPDCard";
import UserCards from "@/components/UserCards";
import ShortCuts from "@/components/ShortCuts";
import MentorCard from "@/components/MentorCard";
import { AuthContext } from "@/contexts/AuthContext";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const { setLoading } = useContext(LoadingContext);
  const router = useRouter();

  const [avatar, setAvatar] = useState(null); // State to store the selected file
  const [avatarPreview, setAvatarPreview] = useState(null); // State to store the preview URL

  const [onlineUserCountByRole, setOnlineUserCountByRole] = useState({
    admin: 0,
    mentor: 0,
    student: 0,
    cpd_provider: 0,
  });

  const [coursesCount, setCoursesCount] = useState({
    totalEnrolledCourses: 0,
    totalApprovedCourses: 0,
    courseDetails: [],
  });

  const [setting, setSetting] = useState(null);
  const [yearlyCPD, setYearlyCPD] = useState(0);
  const [monthlyCPD, setMonthlyCPD] = useState(0);

  const [mentor, setMentor] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchMentorDetails();
    fetchSettings(user?._id);
    fetchData();
    setLoading(false);
  }, [setLoading]);

  const fetchMentorDetails = async () => {
    try {
      const mentorDetails = await fetchMentorByCurrentUser();
      console.log("mentorDetails", mentorDetails);
      setMentor(mentorDetails);
      console.log("Mentor Details:", mentorDetails);
    } catch (error) {
      console.error("Failed to fetch mentor details", error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getUserData();
      const countData = await getUserCount();
      const courseCountData = await getUserCoursesCount();
      courseCountData.totalApprovedCourses =
        courseCountData.courseDetails.length;
      setOnlineUserCountByRole(countData?.onlineUserCountByRole);
      setCoursesCount(courseCountData);
      setLoading(false);
      console.log("data", data, countData, courseCountData);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchSettings = async (id) => {
    const settings = await getSettingByID(id);
    setSetting(settings?.body);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const monthlyTarget =
      settings?.body?.cpdTarget?.[currentYear]?.[currentMonth]?.monthly || 0;
    const yearlyTarget =
      settings?.body?.cpdTarget?.[currentYear]?.[currentMonth]?.yearly || 0;
    setMonthlyCPD(monthlyTarget);
    setYearlyCPD(yearlyTarget);
  };

  const navigateShortCuts = (type) => {
    if (type === "course" && user?.role === userRoles.SITE_ADMIN) {
      router.push(routes.ADMIN_COURSES);
    } else if (type === "course" && user?.role === userRoles.STUDENT) {
      router.push(routes.ADMIN_COURSES);
    }
  };

  return (
    <div className={styles.layout}>
      <div className={styles.topRow}>
        <AvatarBox
          user={user}
          avatarPreview={avatarPreview}
          handleAvatarChange={handleAvatarChange}
        />
        <div className={styles.cpd}>
          <div className={styles.cpdItem}>
            <CPDCard
              user={user}
              setting={setting}
              monthlyCPD={monthlyCPD}
              yearlyCPD={yearlyCPD}
            />
            <ShortCuts user={user} navigateShortCuts={navigateShortCuts} />
          </div>
        </div>
        <UserCards
          onlineUserCountByRole={onlineUserCountByRole}
          user={user}
          coursesCount={coursesCount}
        />
      </div>
      <div className={styles.bottomRow}>
        <div className={styles.info}>
          <p>Mentor Info Section</p>
          {mentor ? (
            <MentorCard mentor={mentor} user={user} />
          ) : (
            <Typography>No mentor assigned or details unavailable.</Typography>
          )}
        </div>
        <div className={styles.chart}>
          {coursesCount.courseDetails?.map((course, index) => (
            <CourseCard key={index} course={course} margin={3} />
          ))}
        </div>
      </div>
    </div>
  );
}
