import React from "react";
import { motion } from "framer-motion";
import { Globe, Target, Heart } from "lucide-react";
import abo from "../../assets/about.png";

const AboutSection = () => {
  return (
    <section
      id="about-section"   // ✅ added ID for smooth scroll
      className="relative bg-white overflow-hidden py-20 px-4 lg:px-16"
    >
      

      <div className="relative max-w-7xl mx-auto grid items-center lg:grid-cols-2 gap-12">
        {/* Text Column */}
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-extrabold text-gray-800 mb-6"
          >
            Who We Are
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg text-gray-600 leading-relaxed mb-8"
          >
            At Trendra, we believe in transforming urban mobility. Our platform
            makes public transportation smarter, efficient, and reliable with
            real-time tracking and smart route planning. Everything we do is
            geared toward reimagining your daily commute.
          </motion.p>
        </div>

        {/* Image Column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full h-64 bg-blue-100 rounded-2xl"
        >
          <img
            src={abo}
            alt="Trendra illustration"
            className="w-full h-full object-cover rounded-2xl"
          />
        </motion.div>
      </div>

      {/* Mission / Vision / Values Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.2 },
          },
        }}
        className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
      >
        {[
          {
            icon: <Globe size={28} className="text-blue-600" />,
            title: "Global Reach",
            desc: "Connecting commuters across cities with ease.",
          },
          {
            icon: <Target size={28} className="text-blue-600" />,
            title: "Precision Planning",
            desc: "Optimized routes for dependable travel.",
          },
          {
            icon: <Heart size={28} className="text-blue-600" />,
            title: "Customer Focused",
            desc: "Built to deliver convenience and reliability.",
          },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="bg-gray-50 p-6 rounded-xl text-center shadow-lg"
          >
            <div className="mb-4 flex justify-center">{card.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {card.title}
            </h3>
            <p className="text-gray-600">{card.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default AboutSection;
