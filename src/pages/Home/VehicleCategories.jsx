import React from "react";
import { motion } from "framer-motion";
import car1 from "../../assets/car1.png";
import car2 from "../../assets/car2.png";
import car3 from "../../assets/car3.png";
import car4 from "../../assets/car4.png";

const VehicleCategories = () => {
  const categories = [
    {
      id: 1,
      image: car1,
      title: "Sedans",
      description:
        "Best for couples or small families. Comfortable and budget-friendly.",
    },
    {
      id: 2,
      image: car2,
      title: "SUVs",
      description: "Perfect for group trips with extra space.",
    },
    {
      id: 3,
      image: car3,
      title: "Travellers & Minivans",
      description:
        "Spacious seating for large families, friends, or corporate trips.",
    },
    {
      id: 4,
      image: car4,
      title: "Tourist Buses",
      description:
        "Spacious and comfortable rides for large groups and long journeys.",
    },
  ];

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-[1304px] mx-auto px-4">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[28px] sm:text-[32px] font-semibold text-gray-900 mb-3 tracking-tight"
          >
            Find the Perfect Ride for Every Journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-base text-gray-600 max-w-[900px] mx-auto leading-relaxed"
          >
            From cozy sedans to spacious Travellers, choose a vehicle that fits
            your trip and style — with extra features to make it truly yours.
          </motion.p>
        </div>

        {/* Row 1 */}
        <div className="grid grid-cols-[60%_40%] gap-6 mb-6 h-[280px]">
          {categories.slice(0, 2).map((cat) => (
            <motion.div
              key={cat.id}
              className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer"
            >
              <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${cat.image})` }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <h3 className="text-lg font-semibold mb-1">{cat.title}</h3>
                <p className="text-sm">{cat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-[40%_60%] gap-6 h-[280px]">
          {categories.slice(2, 4).map((cat) => (
            <motion.div
              key={cat.id}
              className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer"
            >
              <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${cat.image})` }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <h3 className="text-lg font-semibold mb-1">{cat.title}</h3>
                <p className="text-sm">{cat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VehicleCategories;
