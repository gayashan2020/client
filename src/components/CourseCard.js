// src/components/CourseCard.js

import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CardMedia,
  Box,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";

const CourseCard = ({ course, margin }) => {
  const router = useRouter();
  const isMobileOrTablet = useMediaQuery("(max-width:960px)");

  const cardStyle = {
    margin: margin?margin:"1px",
    width: 250,
    height: 400,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.2s ease-in-out",
    backgroundColor: "#fff",
    "&:hover": {
      transform: "scale(1.05)",
    },
  };

  const navigateToCourse = (course) => {
    router.push(`/admin/courses/${course.category}/${course?._id?course?._id:course?.courseId}`);
  };

  const normalizeDates = (dates) => {
    // Check if the date string contains "and", "to", or "-"
    if (dates?.includes("and")) {
      return dates?.replace("and", "to");
    } else if (dates?.includes("–")) {
      return dates?.replace("–", "to");
    }
    return dates;
  };

  const { image, event, dates, total_cpd_points, category, organizing_body } =
    course;
  return (
    <Card sx={cardStyle} onClick={() => navigateToCourse(course)}>
      <CardActionArea
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "flex-start",
          color: "black",
          fontSize: "1rem",
          textAlign: "right",
        }}
      >
        <CardMedia
          component="img"
          height="140"
          image={image || "/static/placeholderImage.webp"}
          alt={event}
        />
        <CardContent>
          <Typography
            component="div"
            gutterBottom
            style={{ textAlign: "center" }}
          >
            {event}
          </Typography>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <Typography variant="body2" color="dark-gray" mr={1}>
              Dates:
            </Typography>
            <Typography
              variant="body2"
              color="gray"
              fontWeight="fontWeightMedium"
            >
              {normalizeDates(dates)}
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={1}
          >
            <Typography variant="body2" color="dark-gray" mr={1}>
              CPD Total:
            </Typography>
            <Typography
              variant="body2"
              color="gray"
              fontWeight="fontWeightMedium"
            >
              {total_cpd_points}
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={1}
          >
            <Typography variant="body2" color="dark-gray" mr={1}>
              Type:
            </Typography>
            <Typography
              variant="body2"
              color="gray"
              fontWeight="fontWeightMedium"
            >
              {category}
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={1}
          >
            <Typography variant="body2" color="dark-gray" mr={1}>
              By:
            </Typography>
            {isMobileOrTablet ? (
              <Typography
                variant="body2"
                color="gray"
                fontWeight="fontWeightMedium"
                style={{
                  fontSize: "0.85rem",
                  lineHeight: "1",
                }}
              >
                {organizing_body}
              </Typography>
            ) : (
              <Tooltip title={organizing_body} arrow>
                <Typography
                  variant="body2"
                  color="gray"
                  fontWeight="fontWeightMedium"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "150px",
                  }}
                >
                  {organizing_body?.length > 50
                    ? `${organizing_body?.substring(0, 50)}...`
                    : organizing_body}
                </Typography>
              </Tooltip>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CourseCard;
