import React, { useEffect, useState } from 'react';
import { fetchCourses } from "@/services/courses";
import { Box, Typography, Grid, Card, CardContent, Button, Skeleton } from '@mui/material';
import Image from 'next/image';
import { useRouter } from "next/router";

const CourseCard = ({ course, action }) => (
  <Card
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      transition: 'transform 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 24px rgba(44, 102, 110, 0.15)',
      },
    }}
  >
    <Box
      sx={{
        position: 'relative',
        pt: '56.25%', // 16:9 aspect ratio
        overflow: 'hidden',
      }}
    >
      <Image
        src={course.image || '/static/placeholderImage.webp'}
        alt={course.name}
        width={500}
        height={281}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </Box>

    <CardContent
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
      }}
    >
      <Typography
        variant="h5"
        component="h3"
        sx={{ color: '#2C666E', mb: 1.5 }}
      >
        {course.event}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {course.description}
      </Typography>
      {/* Spacer to push the button to the bottom */}
      <Box sx={{ flexGrow: 1 }} />
      <Button
        variant="outlined"
        sx={{
          borderColor: '#2C666E',
          color: '#2C666E',
          '&:hover': {
            backgroundColor: '#2C666E',
            color: 'white',
            borderColor: '#1a4a52',
          },
        }}
        onClick={() => action(course)}
      >
        View Course
      </Button>
    </CardContent>
  </Card>
);


export const FeaturedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await fetchCourses();
        const selectedCourses = selectRandomCourses(response, 4);
        setCourses(selectedCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    getCourses();
  }, []);

  const navigateToCourse = (course) => {
    router.push(`/admin/courses/${course.category}/${course?._id?course?._id:course?.courseId}`);
  };

  const selectRandomCourses = (courses, count) => {
    const shuffled = [...courses].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  return (
    <Box component="section" sx={{ py: 8, backgroundColor: '#f8f9fa' }}>
      <Typography 
        variant="h3" 
        component="h2" 
        sx={{ 
          textAlign: 'center', 
          mb: 6,
          color: '#2C666E',
          position: 'relative',
          '&:after': {
            content: '""',
            display: 'block',
            width: '60px',
            height: '4px',
            backgroundColor: '#ff7f50',
            margin: '16px auto 0'
          }
        }}
      >
        Featured Courses
      </Typography>
      
      <Grid container spacing={4} sx={{ px: 4 }}>
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
              <Skeleton variant="text" sx={{ fontSize: '1.5rem', mt: 2 }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem', width: '60%' }} />
            </Grid>
          ))
        ) : (
          courses.map((course) => (
            <Grid item xs={12} sm={6} md={3} key={course._id}>
              <CourseCard course={course} action={navigateToCourse}/>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};