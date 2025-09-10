import React from "react";
import { motion } from "framer-motion";

import ab1 from "../../assets/ab1.png";
import ab2 from "../../assets/ab2.png";
import ab3 from "../../assets/ab3.png";

const steps = [
  {
    id: 1,
    icon: <img src={ab1} alt="Plan Your Trip" className="w-16 h-16 object-contain" />,
    title: "Plan Your Trip",
    description:
      "Enter your pickup and destination. Get instant transparent fares and route options tailored to your needs.",
  },
  {
    id: 2,
    icon: <img src={ab2} alt="Choose Your Ride" className="w-16 h-16 object-contain" />,
    title: "Choose Your Ride",
    description:
      "Pick a vehicle that suits your style. From budget rides to premium comfort, customize it your way.",
  },
  {
    id: 3,
    icon: <img src={ab3} alt="Confirm & Go" className="w-16 h-16 object-contain" />,
    title: "Confirm & Go",
    description:
      "Pay a small advance, get driver details, and enjoy a smooth travel experience with full transparency.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works-section"
      className="w-full bg-gray-50 py-20 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            How It <span className="text-blue-600">Works</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A simple, 3-step process to plan, book, and ride with confidence.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Animated line between steps */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-blue-600 -z-10"
          ></motion.div>

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center text-center max-w-xs relative z-10 hover:shadow-2xl transition-all duration-300"
            >
              {/* Step Circle with hover animation */}
              <motion.div
                whileHover={{ scale: 1.2, rotate: 15 }}
                className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-100 mb-6 shadow-md"
              >
                {step.icon}
              </motion.div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm">{step.description}</p>

              {/* Step number floating */}
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 0.1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute text-[100px] font-extrabold text-gray-200 bottom-0 right-4 -z-10"
              >
                {step.id}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
