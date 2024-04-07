import SchoolIcon from "@mui/icons-material/School";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import GroupIcon from "@mui/icons-material/Group";
import ChatIcon from "@mui/icons-material/Chat";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";

export const cardData = [
    {
      title: "What is CPD",
      description:
        "CPD stands for Continuing Professional Development. It is a continuous process beginning from the day you start practicing as a doctor. The term Professional Development has a broader meaning than just acquiring new knowledge or skills as a doctor and encompasses one’s own personal development as well.",
      image: "sec2_1.png",
      reverse: false,
    },
    {
      title: "National CPD Certificate",
      description:
        "Your NCPD Certificate will be issued by the NCCPDIM after you collect a minimum number of CPD credits (30 credits) in the first year. Renewal cycle is of three years duration. What's more, it costs nothing to you as the programme is funded by the Ministry of Health.",
      image: "sec2_2.png",
      reverse: true,
    },
    {
      title: "Benefits of NCPDC",
      description:
        "Recognition by overseas professional bodies. Protection against litigation when your skills are challenged in a court of law. Can be displayed at your practice to increase your patients’ confidence in you. Boosts your morale and self satisfaction.",
      image: "sec2_3.png",
      reverse: false,
    },
    {
      title: "What's available",
      description:
        "A range of learning opportunities approved by the NCCPDIM such as workshops, conferences, webinars, and workspace-based learning are available. Mentors will be available to guide you and help you identify your learning needs. An online portfolio management system will be available to record and assess evidence, provide feedback, and award CPD credits and certification.",
      image: "sec2_4.png",
      reverse: true,
    },
  ];

  export const activities = [
    {
      title: "Knowledge, skills development and change in performance",
      items: ["Specific/structured learning", "Workplace based learning"],
      icon: <SchoolIcon />,
    },
    {
      title: "Research, innovations and publication",
      items: [
        "Editing paper-reviewed publications",
        "Authoring research articles, chapters in books",
      ],
      icon: <LightbulbIcon />,
    },
    {
      title: "Leadership/teamwork skills",
      items: [
        "Conducting or participating in formal courses",
        "Training programs related to leadership",
      ],
      icon: <GroupIcon />,
    },
    {
      title: "Communication skills, IT skills and social skills",
      items: [
        "Conducting or participating in meetings",
        "Multi-disciplinary/multi-professional meetings",
      ],
      icon: <ChatIcon />,
    },
    {
      title: "Teaching/mentoring/coaching",
      items: ["Formal basic training", "Contributing to educational programs"],
      icon: <CastForEducationIcon />,
    },
  ];