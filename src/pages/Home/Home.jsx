import React, { useState } from "react";
import Hero from "./Hero";
import VehicleCategories from "./VehicleCategories";
import About from "./About";
import AboutSection from "./AboutSection";
import HowItWorks from "./HowItWorks";
import MobileApp from "./MobileApp";
import Earn from "./Earn";
import Testimonials from "./Testimonials";
import Newsletter from "./Newsletter";

const Home = ({ setBookingFormData }) => {
  return (
    <>
      <Hero setBookingFormData={setBookingFormData} />
      <VehicleCategories />
      <About id="about-section" />
      <AboutSection />
      <HowItWorks />
      <MobileApp />
      <Earn />
      <Testimonials />
      <Newsletter />
    </>
  );
};

export default Home;