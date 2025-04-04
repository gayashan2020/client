import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  Link,
} from "@mui/material";
import { Navbar } from "@/components/landingPageComponents/navbar";
import { FeaturedCourses } from "@/components/landingPageComponents/featuredCourse";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Image from "next/image";
import bannerImage from "@/assets/bannerImg1.png";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import PolicyIcon from "@mui/icons-material/Policy";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { keyframes } from "@mui/system";

// Create custom keyframes
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const scaleUp = keyframes`
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const courses = [
  {
    icon: <MedicalServicesIcon fontSize="large" />,
    title: "Clinical Specializations",
    description:
      "Advanced courses in various medical specialties with CPD accreditation",
  },
  {
    icon: <SchoolIcon fontSize="large" />,
    title: "Medical Education",
    description: "Enhance your teaching skills in medical education frameworks",
  },
  {
    icon: <AssignmentIcon fontSize="large" />,
    title: "Research Methodology",
    description: "Master medical research techniques and publication ethics",
  },
];

const faqItems = [
  {
    question: "How do I access accredited CPD programmes?",
    answer:
      "Create an account, verify your medical credentials, and browse our curated list of accredited programmes.",
  },
  {
    question: "Are these courses recognized internationally?",
    answer:
      "All programmes are accredited by NCCPDM and meet international continuing education standards.",
  },
  {
    question: "Can I track my learning progress?",
    answer:
      "Yes, our platform provides detailed analytics and certification tracking for all completed courses.",
  },
];

const statistics = [
  {
    title: "Total Courses",
    value: "850+",
    icon: <SchoolIcon fontSize="large" />,
    color: "#2C666E",
  },
  {
    title: "Active Students",
    value: "25K+",
    icon: <PersonIcon fontSize="large" />,
    color: "#ff7f50",
  },
  {
    title: "Expert Mentors",
    value: "1.2K+",
    icon: <GroupsIcon fontSize="large" />,
    color: "#2C666E",
  },
  {
    title: "Completed Courses",
    value: "150K+",
    icon: <AssignmentTurnedInIcon fontSize="large" />,
    color: "#ff7f50",
  },
];

const LandingPage = () => {
  return (
    <>
      <Navbar />

      {/* Hero Section with Banner Image */}
      <Box
        sx={{
          backgroundColor: "#f8f9fa",
          py: 8,
          position: "relative",
          overflow: "hidden",
          minHeight: 600,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Text Content */}
          <Box
            sx={{
              flex: 1,
              pr: { md: 4 },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: "2rem", sm: "3rem" },
                color: "#2C666E",
                lineHeight: 1.2,
                mb: 3,
              }}
            >
              Enhance your{" "}
              <Box component="span" sx={{ color: "#ff7f50" }}>
                Medical Career
              </Box>{" "}
              with the official ePortal of the{" "}
              <Box component="span" sx={{ color: "#ff7f50" }}>
                National Committee for CPD in Medicine (NCCPDM)
              </Box>
            </Typography>

            <Typography
              variant="h5"
              component="p"
              sx={{
                mb: 4,
                color: "text.secondary",
                maxWidth: 600,
              }}
            >
              Discover all accredited CPD programmes in one place
            </Typography>

            <Button
              variant="contained"
              size="large"
              sx={{
                px: 6,
                py: 1.5,
                backgroundColor: "#2C666E",
                "&:hover": { backgroundColor: "#1a4a52" },
              }}
            >
              Explore Courses
            </Button>
          </Box>

          {/* Banner Image */}
          <Box
            sx={{
              flex: 1,
              mt: { xs: 6, md: 0 },
              textAlign: "center",
              position: "relative",
              zIndex: 0,
            }}
          >
            <Image
              src={bannerImage}
              alt="Medical professionals learning"
              style={{
                maxWidth: "100%",
                height: "auto",
                filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))",
                animation: "float 6s ease-in-out infinite",
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Learning Section - Updated Color Scheme */}
      <Container sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          sx={{
            textAlign: "center",
            mb: 6,
            color: "#2C666E",
          }}
        >
          Our CPD Programmes
        </Typography>

        <Grid container spacing={4}>
          {courses.map((course, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    borderBottom: `4px solid #2C666E`,
                  },
                }}
              >
                <CardContent
                  sx={{
                    textAlign: "center",
                    p: 4,
                    "& svg": { color: "#2C666E" },
                  }}
                >
                  <Box sx={{ mb: 2 }}>{course.icon}</Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {course.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {course.description}
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{
                      mt: 3,
                      borderColor: "#2C666E",
                      color: "#2C666E",
                      "&:hover": {
                        backgroundColor: "#2C666E",
                        color: "white",
                      },
                    }}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box
        sx={{
          py: 8,
          background: `linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              textAlign: "center",
              mb: 6,
              color: "#2C666E",
              position: "relative",
              "&:after": {
                content: '""',
                display: "block",
                width: "60px",
                height: "4px",
                backgroundColor: "#ff7f50",
                margin: "16px auto 0",
                animation: `${floatAnimation} 7s ease-in-out infinite`,
              },
            }}
          >
            Advancing Medical Education Nationwide
          </Typography>

          <Grid container spacing={4} sx={{ alignItems: "stretch" }}>
            {statistics.map((stat, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={index}
                sx={{ display: "flex" }}
              >
                <Box
                  sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 2,
                    backgroundColor: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 8px 32px rgba(44, 102, 110, 0.1)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    animation: `${scaleUp} 1s ease-out ${index * 0.1}s both`,
                    "&:hover": {
                      transform: "translateY(-8px) scale(1.02)",
                      boxShadow: "0 12px 40px rgba(44, 102, 110, 0.2)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      backgroundColor: stat.color,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 24px",
                      color: "white",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.1)",
                        backgroundColor:
                          stat.color === "#2C666E" ? "#ff7f50" : "#2C666E",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        animation: `${floatAnimation} 3s ease-in-out infinite`,
                      }}
                    >
                      {stat.icon}
                    </Box>
                  </Box>
                  <Typography
                    variant="h2"
                    component="div"
                    sx={{
                      fontWeight: 700,
                      color: stat.color,
                      mb: 1,
                      minHeight: "3.5rem",
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#2C666E",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      flexGrow: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {stat.title}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              mt: 6,
              color: "#2C666E",
              maxWidth: 800,
              mx: "auto",
              fontStyle: "italic",
            }}
          >
            Join thousands of medical professionals who trust NCCPDM for their
            continuing professional development needs
          </Typography>
        </Container>
      </Box>

      <Box sx={{ py: 8, backgroundColor: "#ffffff" }}>
        <Container>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              textAlign: "center",
              mb: 6,
              color: "#2C666E",
              position: "relative",
              "&:after": {
                content: '""',
                display: "block",
                width: "60px",
                height: "4px",
                backgroundColor: "#ff7f50",
                margin: "16px auto 0",
              },
            }}
          >
            Frequently Asked Questions
          </Typography>

          <Box sx={{ maxWidth: 800, margin: "0 auto" }}>
            {faqItems.map((faq, index) => (
              <Accordion
                key={index}
                sx={{
                  boxShadow: "none",
                  border: "1px solid #e0e0e0",
                  mb: 2,
                  "&:before": { display: "none" },
                  "&.Mui-expanded": { margin: 0 },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#2C666E" }} />}
                  sx={{
                    backgroundColor: "#f8f9fa",
                    "&:hover": { backgroundColor: "#f1f3f5" },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "#2C666E", fontWeight: 600 }}
                  >
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: "white" }}>
                  <Typography variant="body1" color="text.secondary">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>

      <FeaturedCourses />

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: "#2C666E",
          color: "common.white",
          py: 8,
          position: "relative",
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            backgroundColor: "#ff7f50",
          },
          background: `linear-gradient(150deg, #1a4a52 0%, #2C666E 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <ContactMailIcon sx={{ mr: 1.5, fontSize: 30 }} />
                <Typography variant="h6">Contact Information</Typography>
              </Box>
              <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                NCCPDM Headquarters
                <br />
                123 Medical Education Way
                <br />
                Knowledge City, PC 45678
                <br />
                Email: contact@nccpdm.org
                <br />
                Phone: +1 (555) 123-4567
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PolicyIcon sx={{ mr: 1.5, fontSize: 30 }} />
                <Typography variant="h6">Legal & Policies</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Link href="#" color="inherit" underline="hover">
                  Privacy Policy
                </Link>
                <Link href="#" color="inherit" underline="hover">
                  Terms of Service
                </Link>
                <Link href="#" color="inherit" underline="hover">
                  Accreditation Standards
                </Link>
                <Link href="#" color="inherit" underline="hover">
                  Code of Conduct
                </Link>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <GroupsIcon sx={{ mr: 1.5, fontSize: 30 }} />
                <Typography variant="h6">Connect With Us</Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 3 }}>
                <Link
                  href="#"
                  color="inherit"
                  sx={{ "&:hover": { color: "#ff7f50" } }}
                >
                  <Box
                    component="img"
                    src="/icons8-linkedin.svg"
                    sx={{ width: 32, filter: "brightness(1) invert(1)" }}
                  />
                </Link>
                <Link
                  href="#"
                  color="inherit"
                  sx={{ "&:hover": { color: "#ff7f50" } }}
                >
                  <Box
                    component="img"
                    src="/icons8-twitter.svg"
                    sx={{ width: 32, filter: "brightness(1) invert(1)" }}
                  />
                </Link>
                <Link
                  href="#"
                  color="inherit"
                  sx={{ "&:hover": { color: "#ff7f50" } }}
                >
                  <Box
                    component="img"
                    src="/icons8-facebook.svg"
                    sx={{ width: 32, filter: "brightness(1) invert(1)" }}
                  />
                </Link>
              </Box>
              <Typography variant="body2" sx={{ mt: 4, opacity: 0.9 }}>
                Subscribe to our newsletter for updates:
              </Typography>
              <Box component="form" sx={{ mt: 1, display: "flex", gap: 1 }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid rgba(255,255,255,0.3)",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    color: "white",
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#ff7f50",
                    "&:hover": { backgroundColor: "#ff6b3a" },
                  }}
                >
                  Subscribe
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Typography
            variant="body2"
            align="center"
            sx={{
              mt: 6,
              pt: 4,
              borderTop: "1px solid rgba(255,255,255,0.1)",
              fontSize: "0.875rem",
              letterSpacing: "0.5px",
            }}
          >
            © 2023 NCCPDM. All rights reserved. | Committed to Excellence in
            Medical Education
          </Typography>
        </Container>
      </Box>
    </>
  );
};

// Add floating animation in your global CSS
const globalStyles = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }
`;

export default LandingPage;
