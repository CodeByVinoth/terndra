import React from "react";
import { motion } from "framer-motion";
import earn from "../../assets/earnp.png";

const Earn = () => {
  return (
    <section className="w-full bg-white py-12 sm:py-16 flex justify-center text-white relative overflow-hidden">
      <div className="max-w-[1300px] w-full mx-auto px-6 relative z-10">
        <div className="bg-sky-800 rounded-[24px] sm:rounded-[36px] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">

          {/* Left Content */}
          <motion.div
            className="text-center md:text-left space-y-5 flex-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-snug"
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Turn your vehicle into{" "}
              <span className="text-yellow-400">Earnings</span>
            </motion.h2>

            <motion.p
              className="text-sm sm:text-base max-w-md mx-auto md:mx-0 text-gray-200"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              List your car, van, or traveller and start earning with every trip.
            </motion.p>

            {/* Blue Button */}
            <div className="flex justify-center md:justify-start gap-4 mt-6">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(255,255,255,0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                JOIN NOW
              </motion.a>
            </div>
          </motion.div>

          {/* Right Content - Image */}
          <motion.div
            className="flex justify-center items-center flex-1 relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Background floating circles */}
            <motion.div
              className="absolute w-40 h-40 bg-yellow-400/20 rounded-full top-0 right-0"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 15, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute w-32 h-32 bg-blue-300/20 rounded-full bottom-0 left-0"
              animate={{ scale: [1, 1.15, 1], rotate: [0, -15, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Main image */}
            <motion.img
              src={earn}
              alt="Earn with vehicle"
              className="max-h-[220px] sm:max-h-[300px] lg:max-h-[360px] object-contain relative z-10"
              animate={{ y: [0, -15, 0], rotate: [0, 2, -2, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.05, rotate: 0 }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Earn;
