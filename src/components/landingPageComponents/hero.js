import { Button } from "@mui/material";
import style from "../../styles/landingPage.module.css"
export const HeroSection = () => {
  return (
    <div className={style.main_hero_container}>
      <div className={style.title}>NATIONAL CPD SYSTEM FOR HEALTH PROFESSIONALS</div>
      <div className={style.sub_title}>Learning and E-Portfolio Management System</div>
      <Button
        className={style.login_btn}
        variant="contained"
        color="primary"
      ></Button>
      <Button
        className={style.register_btn}
        variant="contained"
        color="primary"
      ></Button>
    </div>
  );
};
