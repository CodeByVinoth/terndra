import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiCheckCircle } from "react-icons/fi";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle', 'sending', 'sent'

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");
    // Simulate API call
    setTimeout(() => {
      setStatus("sent");
    }, 2000); // 2-second delay to simulate sending
  };

  const formVariants = {
    hidden: { opacity: 0, y: 30, transition: { duration: 0.5 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -30, transition: { duration: 0.5 } },
  };

  const successVariants = {
    hidden: { scale: 0.8, opacity: 0, transition: { duration: 0.5 } },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <section
      id="contact-section" // ✅ added ID for smooth scroll
      className="w-full pt-8 pb-8 bg-gradient-to-t from-blue-50 via-white to-blue-50"
    >
      <div className="max-w-[1200px] mx-auto px-1 flex flex-col items-center gap-5">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
          Stay Connected
        </h2>
        <p className="text-gray-600 text-lg text-center max-w-xl">
          Subscribe to our newsletter for exclusive updates, special offers, and a smoother journey with us.
        </p>

        <div className="relative w-full flex justify-center min-h-[150px]">
          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto z-10"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="relative w-full sm:w-[350px]">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-12 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700 placeholder-gray-400 w-full"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-xl shadow-lg w-full sm:w-auto"
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  Subscribe
                </motion.button>
              </motion.form>
            )}

            {status === "sending" && (
              <motion.div
                key="sending"
                className="absolute flex items-center justify-center gap-3 w-full h-full text-blue-500"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <motion.div
                  className="w-8 h-8 rounded-full border-4 border-t-4 border-blue-500 border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ ease: "linear", duration: 1, repeat: Infinity }}
                />
                <motion.span
                  className="text-xl font-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Sending...
                </motion.span>
              </motion.div>
            )}

            {status === "sent" && (
              <motion.div
                key="success"
                className="flex flex-col items-center gap-4 text-center absolute w-full"
                variants={successVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <FiCheckCircle className="text-green-500 text-6xl" />
                </motion.div>
                <motion.h3
                  className="text-2xl md:text-3xl font-bold text-gray-800"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  You're All Set! 🎉
                </motion.h3>
                <motion.p
                  className="text-gray-600"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Thanks for subscribing. Check your inbox for our first update!
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;