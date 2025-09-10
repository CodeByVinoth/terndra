import React, { useState, useEffect } from "react";
import BookingForm from "./BookingForm.jsx";

import img1 from "../../assets/img1.png";
import img2 from "../../assets/img2.png";
import img3 from "../../assets/img3.png";
import img4 from "../../assets/img4.png";
import img5 from "../../assets/img5.png";

const Hero = ({ setBookingFormData }) => {
  const images = [img1, img2, img3, img4, img5];
  const texts = [
    {
      title: "Choose the Ride That Fits You",
      desc: "From students to families, find the perfect vehicle for your journey.",
    },
    {
      title: "Affordable Trips, Exclusive Deals",
      desc: "Enjoy per-km pricing + driver pay included. No hidden costs",
    },
    {
      title: "Reliable Travel, Hassle-Free",
      desc: "Transparent fares, trusted drivers, and instant booking confirmation.",
    },
    {
      title: "Make Your Ride, Your Style",
      desc: "Customize your ride with lights, music, and comfort your way.",
    },
    {
      title: "Adventure Starts Here",
      desc: "Explore new destinations with the right vehicle by your side.",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section id="home" className="relative w-full h-[calc(100vh-55px)] overflow-hidden">
      <div className="absolute inset-0 z-0">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index + 1}`}
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute bottom-16 right-4 sm:right-6 md:right-16 text-white text-right w-2/3 sm:w-1/2 md:w-1/3 p-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-snug transition-opacity duration-1000 whitespace-nowrap">
            {texts[current].title}
          </h1>
          <p className="text-[9px] sm:text-xs md:text-sm lg:text-base transition-opacity duration-1000 mt-2 whitespace-nowrap">
            {texts[current].desc}
          </p>
        </div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-6 h-full flex flex-col md:flex-row justify-center md:justify-start items-center md:items-start py-10 md:py-16">
        <div className="flex justify-center md:justify-start w-full sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-2/5">
          <BookingForm setBookingFormData={setBookingFormData} />
        </div>
      </div>

      <div className="absolute bottom-3 sm:bottom-4 right-4 flex gap-2 z-30">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-1 h-1 sm:w-2 sm:h-2 rounded-full transition-all ${
              index === current ? "bg-white sm:w-4" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default Hero;