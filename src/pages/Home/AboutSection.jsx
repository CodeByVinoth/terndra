import React, { useState } from "react";
import { Check, X } from "lucide-react";
import abo from "../../assets/abo.png";

const AboutSection = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const features = [
    "Transparent pricing",
    "Wide range of vehicles",
    "Safe, reliable, and comfortable journeys",
  ];

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <>
      {/* Main About Section */}
      <section
        id="about"
        className="w-full bg-gradient-to-r from-blue-50 via-white to-blue-50 py-20 sm:py-28"
      >
        <div className="max-w-[1300px] mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-12">
          {/* Content */}
          <div className="flex-1 flex flex-col gap-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-snug">
              Your Travel Companion
            </h2>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              We make travel simpler, smarter, and more affordable for everyone.
              Connect with reliable vehicles and trusted drivers, ensuring
              every journey is safe, transparent, and stress-free.
            </p>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-500"
                >
                  <Check className="w-6 h-6 text-blue-500 animate-pulse" />
                  <span className="text-gray-800 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={togglePopup}
              className="mt-8 self-start bg-blue-500 text-white font-semibold px-8 py-3 rounded-3xl hover:bg-blue-600 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Know More
            </button>
          </div>

          {/* Image with floating effects */}
          <div className="relative w-full md:w-[500px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-700 group">
            <img
              src={abo}
              alt="About Us"
              className="w-full h-full object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-700"
            />
            {/* Decorative floating circles */}
            <div className="absolute -top-6 -left-6 w-28 h-28 bg-blue-300 rounded-full opacity-30 animate-pulse"></div>
            <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-blue-400 rounded-full opacity-30 animate-pulse"></div>
            <div className="absolute top-1/2 left-0 w-16 h-16 bg-blue-200 rounded-full opacity-25 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Popup Window */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-500 ease-in-out"
            onClick={togglePopup}
          ></div>

          {/* Modal content with animations */}
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full transform scale-100 opacity-100 transition-all duration-500 ease-in-out animate-pop-in">
            {/* Close button */}
            <button
              onClick={togglePopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-300"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Popup Content */}
            <div className="text-center">
              <h3 className="text-3xl font-extrabold text-blue-600 mb-4 animate-fade-in-up">
                Our Commitment to You
              </h3>
              <p className="text-gray-700 mb-6 animate-fade-in-up delay-100">
                Our mission goes beyond just providing rides. We're dedicated to
                creating a travel ecosystem built on trust, safety, and
                convenience for every user.
              </p>
              <div className="space-y-4 text-left animate-fade-in-up delay-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Check className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="font-semibold text-gray-800">
                    Verified Drivers & Vehicles:{" "}
                    <span className="font-normal text-gray-600">
                      Every driver and vehicle on our platform undergoes a
                      rigorous verification process.
                    </span>
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Check className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="font-semibold text-gray-800">
                    Real-time Tracking:{" "}
                    <span className="font-normal text-gray-600">
                      Stay informed with live GPS tracking of your journey from
                      start to finish.
                    </span>
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Check className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="font-semibold text-gray-800">
                    24/7 Support:{" "}
                    <span className="font-normal text-gray-600">
                      Our customer service team is always available to assist
                      you with any questions or concerns.
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AboutSection;