import styles from "../../styles/Dashboard.module.css";
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from "@mui/material";
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
  getOccupationData,
  fetchSuperAdminData,
} from "@/services/dashboard";
import { fetchMentorByCurrentUser } from "@/services/mentorService";
import { getSettingByID } from "@/services/setting";
import AvatarBox from "@/components/AvatarBox";
import CPDCard from "@/components/CPDCard";
import UserCards from "@/components/UserCards";
import ShortCuts from "@/components/ShortCuts";
import MentorCard from "@/components/MentorCard";
import { AuthContext } from "@/contexts/AuthContext";
import { PieChartComponent } from "@/components/PieChartComponent";
import LineChartComponent from "@/components/LineChartComponent"; // Import LineChartComponent
import UserStatsTabs from "@/components/UserStatsTabs"; // Import UserStatsTabs
import {
  coursesData,
  mentorsData,
  settingsData,
  userData,
} from "@/assets/data/mockData";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import {
  DateRangePicker,
  defaultStaticRanges,
  defaultInputRanges,
} from "react-date-range";
import { addYears, startOfYear, endOfYear, isSameDay } from "date-fns";

const lastYearRange = {
  label: "Last Year",
  range: () => ({
    startDate: startOfYear(addYears(new Date(), -1)),
    endDate: endOfYear(addYears(new Date(), -1)),
  }),
  isSelected: (range) => {
    const definedRange = lastYearRange.range();
    return (
      isSameDay(range.startDate, definedRange.startDate) &&
      isSameDay(range.endDate, definedRange.endDate)
    );
  },
};

// Define a custom static range for "This Year"
const thisYearRange = {
  label: "This Year",
  range: () => ({
    startDate: startOfYear(new Date()),
    endDate: new Date(), // Today's date
  }),
  isSelected: (range) => {
    const definedRange = thisYearRange.range();
    return (
      isSameDay(range.startDate, definedRange.startDate) &&
      isSameDay(range.endDate, definedRange.endDate)
    );
  },
};

export default function AdminDashboard() {
  const { user, loading } = useContext(AuthContext);
  const { setLoading } = useContext(LoadingContext);
  const router = useRouter();

  const [avatar, setAvatar] = useState(null); // State to store the selected file
  const [avatarPreview, setAvatarPreview] = useState(null); // State to store the preview URL
  const [occupationData, setOccupationData] = useState([]);
  const [setting, setSetting] = useState(null);
  const [yearlyCPD, setYearlyCPD] = useState(0);
  const [monthlyCPD, setMonthlyCPD] = useState(0);
  const [mentor, setMentor] = useState(null);
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
  const [page, setPage] = useState(1);
  const rowsPerPage = 3;

  const [dateRange, setDateRange] = useState([
    {
      startDate: startOfYear(new Date()),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filteredCPD, setFilteredCPD] = useState(settingsData);

  const [mentorDetails, setMentorDetails] = useState([]);

  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange([ranges.selection]);
    filterCoursesByDate(startDate, endDate);
    filterCPDByDate(startDate, endDate);
  };

  const filterCoursesByDate = (startDate, endDate) => {
    const filteredCourses = coursesCount?.courseDetails?.filter((course) => {
      const courseDate = new Date(course.dates);
      return courseDate >= startDate && courseDate <= endDate;
    });
    setFilteredCourses(filteredCourses);
  };

  const filterCPDByDate = (startDate, endDate) => {
    const filteredCPD = settingsData.filter((data) => {
      const dataDate = new Date(data.date);
      return dataDate >= startDate && dataDate <= endDate;
    });
    setFilteredCPD(filteredCPD);
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchOccupationData();
      fetchMentorDetails();
      fetchSettings(user._id);
      fetchData();
      filterCoursesByDate(dateRange[0].startDate, dateRange[0].endDate);
      filterCPDByDate(dateRange[0].startDate, dateRange[0].endDate);
      setLoading(false);
    }
  }, [user]);

  const fetchOccupationData = async () => {
    try {
      const data = await getOccupationData();
      setOccupationData(data);
    } catch (error) {
      console.error("Failed to fetch occupation data", error);
    }
  };

  const fetchMentorDetails = async () => {
    try {
      if (user?.role === "student") {
        const mentorDetails = await fetchMentorByCurrentUser();
        setMentor(mentorDetails);
      } else {
        setMentor([]);
      }
    } catch (error) {
      console.error("Failed to fetch mentor details", error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      if (user?.role === "student") {
        const countData = await getUserCount();
        const courseCountData = await getUserCoursesCount();
        courseCountData.totalApprovedCourses =
          courseCountData.courseDetails.length;
        setOnlineUserCountByRole(countData?.onlineUserCountByRole);
        setCoursesCount(courseCountData);
        setFilteredCourses(courseCountData?.courseDetails);
      } else if (user?.role === "super_admin") {
        const courseCountData = await fetchSuperAdminData(user?._id);
        let courseData = {
          totalEnrolledCourses: 0,
          totalApprovedCourses: 0,
          courseDetails: courseCountData?.courseOverview,
        };
        setCoursesCount(courseData);
        setFilteredCourses(courseCountData?.courseOverview);
        setMentorDetails(courseCountData?.mentorDetails);
      }

      setLoading(false);
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
    try {
      if (user?.role === "student") {
        const settings = await getSettingByID(id);
        setSetting(settings?.body);
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        const monthlyTarget =
          settings?.body?.cpdTarget?.[currentYear]?.[currentMonth]?.monthly ||
          0;
        const yearlyTarget =
          settings?.body?.cpdTarget?.[currentYear]?.[currentMonth]?.yearly || 0;
        setMonthlyCPD(monthlyTarget);
        setYearlyCPD(yearlyTarget);
      }
    } catch (error) {
      console.log("Failed to fetch settings", error);
    }
  };

  const navigateShortCuts = (type) => {
    if (type === "course" && user?.role === userRoles.SITE_ADMIN) {
      router.push(routes.ADMIN_COURSES);
    } else if (type === "course" && user?.role === userRoles.STUDENT) {
      router.push(routes.ADMIN_COURSES);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedCourses = filteredCourses?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.layout}>
      {user?.role === userRoles.SUPER_ADMIN && (
        <div className={styles.dashboard}>
          <div className={styles.topRow}>
            <Card className={styles.chartCard}>
              <DateRangePicker
                ranges={dateRange}
                onChange={handleSelect}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                months={2}
                direction="vertical"
                staticRanges={[
                  ...defaultStaticRanges,
                  lastYearRange,
                  thisYearRange,
                ]}
                inputRanges={defaultInputRanges}
              />
            </Card>
            <UserStatsTabs
              occupationData={occupationData}
              userData={userData}
            />
          </div>
          <div className={styles.middleRow}>
            <Card className={styles.chartCard}>
              <Typography variant="h6">Courses Overview</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Event</TableCell>
                      <TableCell>Organizing Body</TableCell>
                      <TableCell>Dates</TableCell>
                      <TableCell>CPD Points</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>{course.event}</TableCell>
                        <TableCell>{course.organizing_body}</TableCell>
                        <TableCell>{course.dates}</TableCell>
                        <TableCell>{course.total_cpd_points}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Pagination
                count={Math.ceil(filteredCourses.length / rowsPerPage)}
                page={page}
                onChange={handleChangePage}
                color="primary"
                style={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "center",
                }}
              />
            </Card>
          </div>
          <div className={styles.bottomRow}>
            <Card className={styles.chartCard}>
              <Typography variant="h6">
                CPD Points Achieved Over Time
              </Typography>
              <LineChartComponent
                data={filteredCPD.map((item) => item.cpd_points)}
                labels={filteredCPD.map((item) =>
                  new Date(item.date).toLocaleDateString()
                )}
              />
            </Card>
            <Card className={styles.chartCard}>
              <Typography variant="h6">Mentor Info</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mentorDetails.map((mentor) => (
                      <TableRow key={mentor.fullName}>
                        <TableCell>{mentor.fullName}</TableCell>
                        <TableCell>{mentor.email}</TableCell>
                        <TableCell>{mentor.contactNumber}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </div>
        </div>
      )}
      {user?.role === userRoles.STUDENT && (
        <>
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
                <Typography>
                  No mentor assigned or details unavailable.
                </Typography>
              )}
            </div>
            <div className={styles.chart}>
              {coursesCount.courseDetails?.map((course, index) => (
                <CourseCard key={index} course={course} margin={3} />
              ))}
            </div>
          </div>
        </>
      )}

      {user?.role === userRoles.MENTOR && (
        <>
          <div className={styles.topRow}>
            <UserCards
              onlineUserCountByRole={onlineUserCountByRole}
              user={user}
              coursesCount={coursesCount}
            />
          </div>
          <div className={styles.bottomRow}></div>
        </>
      )}
    </div>
  );
}
