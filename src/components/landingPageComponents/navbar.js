import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  InputBase,
  alpha,
  Popover,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Link from "next/link";
import Image from "next/image";
import { routes } from "@/assets/constants/routeConstants";
import { useState } from "react";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#2C666E",
  boxShadow: "none",
  borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(2),
  width: '100%',
  maxWidth: 300,
}));

const StyledPopover = styled(Popover)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 12,
    boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
    marginTop: theme.spacing(1),
    minWidth: 300,
    overflow: "visible",
    "&::before": {
      content: '""',
      display: "block",
      position: "absolute",
      top: -8,
      right: 20,
      width: 16,
      height: 16,
      backgroundColor: theme.palette.background.paper,
      transform: "rotate(45deg)",
      boxShadow: theme.shadows[1],
    },
  },
}));

const ElegantSearch = styled(Search)(({ theme }) => ({
  borderRadius: 50,
  backgroundColor: alpha(theme.palette.common.white, 0.1),
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.2),
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

export const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchAnchorEl, setSearchAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const searchOpen = Boolean(searchAnchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearchClick = (event) => {
    setSearchAnchorEl(event.currentTarget);
  };

  const handleSearchClose = () => {
    setSearchAnchorEl(null);
  };

  const navItems = [
    { label: "Home", href: routes.HOME },
    { label: "Courses", href: routes.COURSES },
    { label: "CPD Providers", href: "#" },
    { label: "Contact Us", href: "#" },
  ];

  const RightSection = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {/* Enhanced Search */}
      <IconButton
        color="inherit"
        onClick={handleSearchClick}
        sx={{
          display: { xs: "none", md: "inline-flex" },
          "&:hover": {
            backgroundColor: alpha(theme.palette.common.white, 0.1),
          },
        }}
      >
        <SearchIcon />
      </IconButton>

      <StyledPopover
        open={searchOpen}
        anchorEl={searchAnchorEl}
        onClose={handleSearchClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        disableRestoreFocus
      >
        <ElegantSearch sx={{ m: 1.5 }}>
          <SearchIconWrapper>
            <SearchIcon fontSize="small" />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search courses…"
            inputProps={{ "aria-label": "search" }}
            sx={{ fontSize: "0.9rem" }}
          />
        </ElegantSearch>
      </StyledPopover>

      {/* Enhanced Login Button */}
      <Link href={routes.LOGIN} passHref>
        <Button
          startIcon={<PersonOutlineIcon sx={{ fontSize: 20 }} />}
          sx={{
            color: "white",
            display: { xs: "none", md: "inline-flex" },
            px: 2,
            py: 1,
            borderRadius: 50,
            border: "1px solid rgba(255,255,255,0.2)",
            "&:hover": {
              backgroundColor: alpha(theme.palette.common.white, 0.1),
              borderColor: alpha(theme.palette.common.white, 0.3),
            },
          }}
        >
          Login
        </Button>
      </Link>

      {/* Enhanced Signup Button */}
      <Link href={routes.REGISTER} passHref>
        <Button
          variant="contained"
          sx={{
            px: 3,
            py: 1,
            borderRadius: 50,
            backgroundColor: "#ff7f50",
            fontWeight: 500,
            letterSpacing: "0.5px",
            "&:hover": {
              backgroundColor: "#ff6b3a",
              boxShadow: "0 4px 12px rgba(255,127,80,0.3)",
            },
          }}
        >
          Sign up
        </Button>
      </Link>
    </Box>
  );

  // Enhanced Mobile Menu
  const MobileMenu = (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleMenuClose}
      sx={{
        "& .MuiPaper-root": {
          borderRadius: 3,
          minWidth: 200,
          boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
          mt: 1.5,
        },
      }}
    >
      {navItems.map((item) => (
        <MenuItem
          key={item.label}
          onClick={handleMenuClose}
          sx={{
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <Link href={item.href} passHref>
            <Typography
              component="a"
              sx={{
                textDecoration: "none",
                color: theme.palette.text.primary,
                px: 2,
                py: 1,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                width: "100%",
              }}
            >
              {item.label}
            </Typography>
          </Link>
        </MenuItem>
      ))}
      <Box
        sx={{ px: 2, pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}
      >
        <Link href={routes.LOGIN} passHref>
          <Button
            fullWidth
            startIcon={<PersonOutlineIcon />}
            sx={{
              justifyContent: "flex-start",
              pl: 3.5,
              borderRadius: 50,
              color: theme.palette.text.primary,
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            Login
          </Button>
        </Link>
      </Box>
    </Menu>
  );

  return (
    <StyledAppBar position="static">
      <Toolbar
        sx={{
          py: 1,
          px: { xs: 2, md: 4 },
          gap: 2,
        }}
      >
        {/* Logo */}
        <Link href={routes.HOME} passHref>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mr: 3,
              cursor: "pointer",
            }}
          >
            <Image
              src="/images/logo.jpg"
              alt="cpd Logo"
              width={70}
              height={50}
              style={{ borderRadius: 8 }}
            />
            <Typography
              variant="h6"
              sx={{
                ml: 2,
                fontWeight: 600,
                display: { xs: "none", md: "block" },
                color: theme.palette.common.white,
              }}
            >
              NCCPDM ePortal
            </Typography>
          </Box>
        </Link>

        {/* Desktop Navigation */}
        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, ml: 3 }}>
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} passHref>
              <Button
                sx={{
                  color: "white",
                  mx: 1,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  },
                }}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </Box>

        {/* Mobile Menu Button */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { md: 'none' }, mr: 1 }}
          onClick={handleMenuOpen}
        >
          <MenuIcon />
        </IconButton>

        {/* Mobile Menu */}
        {MobileMenu}

        {RightSection}
      </Toolbar>
    </StyledAppBar>
  );
};
