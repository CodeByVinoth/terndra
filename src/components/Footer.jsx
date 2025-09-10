import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";
import name from "../assets/name.png";

const Footer = () => {
  const socialIcons = [
    { Icon: FaYoutube, link: "https://youtube.com" },
    { Icon: FaFacebook, link: "https://facebook.com" },
    { Icon: FaTwitter, link: "https://twitter.com" },
    { Icon: FaInstagram, link: "https://instagram.com" },
    { Icon: FaLinkedin, link: "https://linkedin.com" },
  ];

  return (
    <motion.footer
      className="w-full bg-white py-10 px-6 relative overflow-hidden"
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12">
          {/* Logo + Name */}
          <div className="flex items-center gap-3">
            <motion.img
              src={logo}
              alt="Logo"
              className="w-14 h-auto object-contain"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 1 }}
            />
            <img src={name} alt="Name" className="h-8 w-auto object-contain" />
          </div>

          {/* Contact Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center lg:text-left w-full lg:w-auto">
            {/* Call Us */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 border-l-2 border-blue-600 pl-2 inline-block">
                Call Us
              </h4>
              <p className="text-gray-600">+918884447756</p>
            </div>

            {/* Email Us */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 border-l-2 border-blue-600 pl-2 inline-block">
                Email Us
              </h4>
              <p className="text-gray-600">support@yourapp.com</p>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 border-l-2 border-blue-600 pl-2 inline-block">
                Contact Us
              </h4>
              <div className="flex items-center justify-center lg:justify-start gap-4 mt-2">
                {socialIcons.map(({ Icon, link }, i) => (
                  <motion.a
                    key={i}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Icon size={22} />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider + Bottom Text */}
        <div className="border-t border-gray-300 pt-4 text-center text-gray-600 text-sm">
          © 2024 Terndra Inc. All rights reserved
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
