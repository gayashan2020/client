import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Box,
  Tooltip,
  useMediaQuery,
  styled,
  alpha,
} from "@mui/material";
import { useRouter } from "next/router";
import {
  CalendarToday,
  School,
  Category,
  EmojiEvents,
  Groups,
} from "@mui/icons-material";

const ElegantCard = styled(Card)(({ theme }) => ({
  width: 300,
  height: 440, // Fixed height
  borderRadius: "16px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[4],
  display: "flex", // Add flex container
  flexDirection: "column", // Stack children vertically
  position: "relative",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[8],
    "&:after": {
      opacity: 1,
    },
  },
  "&:after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: "16px",
    border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
}));

const CourseCard = ({ course, margin }) => {
  const router = useRouter();
  const isMobileOrTablet = useMediaQuery("(max-width:960px)");

  const navigateToCourse = (course) => {
    router.push(
      `/admin/courses/${course.category}/${course?._id || course?.courseId}`
    );
  };

  const { image, event, dates, total_cpd_points, category, organizing_body } =
    course;

  return (
    <ElegantCard
      onClick={() => navigateToCourse(course)}
      sx={{ m: margin || 2 }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="180"
          image={image || "/static/placeholderImage.webp"}
          alt={event}
          sx={{
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            objectFit: "cover",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: alpha("#000", 0.6),
            p: 1.5,
            backdropFilter: "blur(4px)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "common.white",
              fontWeight: 600,
              lineHeight: 1.2,
              textAlign: "center",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            {event}
          </Typography>
        </Box>
      </Box>

      <CardContent
        sx={{
          px: 2.5,
          pt: 2.5,
          pb: 2,
          flex: 1, // Allow content area to grow
          minHeight: 180, // Set minimum height for content area
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "24px 1fr",
            gap: 1.5,
            flex: 1,
            "& > div:last-child": {
              alignSelf: "flex-end",
            },
          }}
        >
          <DetailItem
            icon={<CalendarToday fontSize="small" />}
            label="Dates"
            value={dates}
          />
          <DetailItem
            icon={<EmojiEvents fontSize="small" />}
            label="CPD Points"
            value={total_cpd_points}
          />
          <DetailItem
            icon={<Category fontSize="small" />}
            label="Type"
            value={category}
          />
          <DetailItem
            icon={<Groups fontSize="small" />}
            label="Organizer"
            value={
              <Tooltip title={organizing_body} arrow>
                <span>{organizing_body}</span>
              </Tooltip>
            }
          />
        </Box>
      </CardContent>
    </ElegantCard>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <>
    <Box
      sx={{
        color: "primary.main",
        display: "flex",
        alignItems: "center",
        height: "100%", // Ensure icon container takes full height
      }}
    >
      {icon}
    </Box>
    <Box
      sx={{
        minHeight: 40, // Minimum height for text container
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          fontWeight: 500,
          lineHeight: 1.2,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          color: "text.primary",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          lineHeight: 1.3,
        }}
      >
        {value}
      </Typography>
    </Box>
  </>
);

export default CourseCard;
