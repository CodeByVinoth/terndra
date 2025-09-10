import React from "react";
import { motion } from "framer-motion";
import googleplay from "../../assets/googleplay.png";
import appstore from "../../assets/appstore.png";
import mobileMockup from "../../assets/mobilemockup.png";

const MobileApp = () => {
  return (
    <section className="w-full bg-white sm:py-16" id="about">
      <div className="max-w-[1304px] mx-auto px-6">
        <div className="bg-gradient-to-t from-blue-200 to-white rounded-[24px] sm:rounded-[36px] p-6 flex flex-col md:flex-row items-center justify-center gap-8">
          
          {/* Left content */}
          <motion.div
            className="text-center md:text-left space-y-5 flex-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Get the <span className="text-blue-600">Terndra</span> App & Travel Smarter
            </motion.h2>

            <motion.p
              className="text-gray-600 text-sm sm:text-base max-w-md mx-auto md:mx-0"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Book rides, track drivers, and customize your trip — all in one tap.
            </motion.p>

            {/* Store Buttons */}
            <motion.div
              className="flex justify-center md:justify-start gap-4 mt-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={googleplay}
                  alt="Get it on Google Play"
                  className="h-10 sm:h-12 w-auto"
                />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={appstore}
                  alt="Download on the App Store"
                  className="h-10 sm:h-12 w-auto"
                />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right content - Mobile Image */}
          <motion.div
            className="flex justify-center items-center flex-1"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.img
              src={mobileMockup}
              alt="Terndra App Mobile Preview"
              className="max-h-[220px] sm:max-h-[280px] object-contain"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default MobileApp;
