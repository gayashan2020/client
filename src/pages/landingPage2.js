import React from "react";
import { HeroSection } from "@/components/landingPageComponents/hero";
import { Navbar } from "@/components/landingPageComponents/navbar";
import { LearningSection } from "@/components/landingPageComponents/learningSection";
import { FeaturedCourses } from "@/components/landingPageComponents/featuredCourse";
export default function landingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <LearningSection/>
      <FeaturedCourses/>
    </>
  );
}
