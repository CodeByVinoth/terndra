import React, { useState, useContext } from "react";
import { Menu, X, Smartphone, LogIn, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TravelContext } from "../pages/vehicle/TravelContext";
import { useNavigate, useLocation } from "react-router-dom";

const Header = ({ onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { token, setToken } = useContext(TravelContext);
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { name: "Home", href: "#home", route: "/" },
    { name: "About Us", href: "#about-section", route: "/" },
    { name: "How it Works", href: "#how-it-works-section", route: "/" },
    { name: "Contact Us", href: "#contact-section", route: "/" },
  ];

  const handleLinkClick = (link) => {
    if (location.pathname !== "/") {
      navigate("/"); // redirect to home first
      setTimeout(() => {
        const el = document.getElementById(link.href.replace("#", ""));
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      const el = document.getElementById(link.href.replace("#", ""));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setIsProfileOpen(false);
    navigate("/"); // redirect to home after logout
  };

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-[1304px] mx-auto px-2">
        <div className="flex items-center justify-between h-[56px]">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src="/logo.png" alt="Logo" className="w-[50px] h-[50px]" />
            <img src="/name.png" alt="Brand" className="h-[40px]" />
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.map((link, idx) => (
              <button
                key={idx}
                onClick={() => handleLinkClick(link)}
                className="relative px-3 py-2 text-gray-800 hover:text-blue-600"
              >
                {link.name}
              </button>
            ))}

            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl"
            >
              <Smartphone size={20} /> Get the App
            </motion.button>

            {!token ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 border border-gray-400 text-gray-800 px-5 py-2 rounded-xl"
                onClick={onLoginClick}
              >
                <LogIn size={20} /> Log In
              </motion.button>
            ) : (
              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 border border-gray-400 text-gray-800 px-5 py-2 rounded-full"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <User size={20} />
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-50"
                    >
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium">
                          {JSON.parse(localStorage.getItem("user"))?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {JSON.parse(localStorage.getItem("user"))?.email}
                        </p>
                      </div>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate("/profile");
                        }}
                      >
                        View Profile
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                className="fixed top-0 left-0 h-full w-[250px] bg-white shadow-lg z-40"
              >
                <nav className="flex flex-col p-6 h-full justify-between">
                  <div className="flex flex-col gap-4">
                    {links.map((link, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleLinkClick(link)}
                        className="py-3 text-gray-800 hover:text-blue-600 text-left"
                      >
                        {link.name}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl"
                    >
                      <Smartphone size={20} /> Get the App
                    </motion.button>

                    {!token ? (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-2 border border-gray-400 text-gray-800 py-3 rounded-xl"
                        onClick={() => {
                          onLoginClick();
                          setIsMenuOpen(false);
                        }}
                      >
                        <LogIn size={20} /> Log In
                      </motion.button>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <button
                          className="py-2 text-left px-4 hover:bg-gray-100"
                          onClick={() => {
                            setIsMenuOpen(false);
                            navigate("/profile");
                          }}
                        >
                          View Profile
                        </button>
                        <button
                          className="py-2 text-left px-4 hover:bg-gray-100 text-red-500"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </nav>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-30"
                onClick={() => setIsMenuOpen(false)}
              />
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
