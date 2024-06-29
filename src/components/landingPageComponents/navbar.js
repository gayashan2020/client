import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';
import styles from "../../styles/navbar.module.css";
import Image from 'next/image';
import {routes} from "@/assets/constants/routeConstants";

export const Navbar = () => {
  return (
    <AppBar position="static" className={styles.navbar}>
      <Toolbar className={styles.toolbar}>
        <Image src="/images/logo.jpg" alt="cpd Logo" width={70} height={50} className={styles.logo} />
        <Typography variant="h6" className={styles.title}>
          E-CPD
        </Typography>
        <div className={styles.menu}>
          <Button color="inherit">Home</Button>
          <Button color="inherit">About</Button>
          <Button color="inherit">Courses</Button>
          <Button color="inherit">Pages</Button>
          <Button color="inherit">Blog</Button>
          <Button color="inherit">Contact</Button>
        </div>
        <div className={styles.rightMenu}>
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
          <IconButton color="inherit">
            <ShoppingCartIcon />
          </IconButton>
          <Link href={routes.LOGIN} passHref>
            <Button color="inherit">Login</Button>
          </Link>
          <Link href={routes.REGISTER} passHref>
            <Button variant="contained" className={styles.signupButton}>Sign up free</Button>
          </Link>
        </div>
      </Toolbar>
    </AppBar>
  );
};
