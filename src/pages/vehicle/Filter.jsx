import React, { useContext, useEffect, useState } from "react";
import TravelsItem from "./TravelsItem";
import { TravelContext } from "./TravelContext";
import { assets } from "../../assets/assets.js";
import {
  Car,
  Users,
  Wifi,
  Music,
  Tv,
  Thermometer,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Accepts onVehicleSelect as a prop
const Filter = ({ onVehicleSelect }) => {
  const [filterTravels, setFilterTravels] = useState([]);
  const [category, setCategory] = useState([]);
  const [seatCapacity, setSeatCapacity] = useState([]);
  const [features, setFeatures] = useState([]);
  const [price, setPrice] = useState(3600);
  const { currency, products } = useContext(TravelContext);

  const toggleFilter = (state, setState, value) => {
    if (state.includes(value)) {
      setState((prev) => prev.filter((item) => item !== value));
    } else {
      setState((prev) => [...prev, value]);
    }
  };

  useEffect(() => {
    let filtered = products;

    if (category.length > 0) {
      filtered = filtered.filter((item) => category.includes(item.comfort));
    }

    if (seatCapacity.length > 0) {
      filtered = filtered.filter((item) => seatCapacity.includes(item.seats));
    }

    if (features.length > 0) {
      filtered = filtered.filter((item) =>
        features.every((feat) => item.features.includes(feat))
      );
    }

    filtered = filtered.filter((item) => item.price <= price);
    setFilterTravels(filtered);
  }, [products, category, seatCapacity, features, price]);

  const handlePriceChange = (e) => {
    setPrice(Number(e.target.value));
  };

  const getFeatureIcon = (feature) => {
    switch (feature) {
      case "WiFi":
        return <Wifi size={18} />;
      case "Music System":
        return <Music size={18} />;
      case "Recliner Seats":
        return <Tv size={18} />;
      case "AC":
        return <Thermometer size={18} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-8">
      {/* Left side - Filters */}
      <div className="lg:w-1/4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Filters</h2>
          {/* You can add a clear filters button here */}
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
          {/* Price Range Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Price Range</h3>
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>₹ 100</span>
              <span>
                Max: {currency} {price}
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="4000"
              value={price}
              onChange={handlePriceChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <hr className="border-t border-gray-100" />

          {/* Vehicle Type Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Vehicle Type</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Hatchback",
                "Sedan",
                "SUV",
                "Luxury",
                "Open Jeep",
              ].map((vehicle) => (
                <button
                  key={vehicle}
                  onClick={() => toggleFilter(category, setCategory, vehicle)}
                  className={`flex items-center gap-2 py-2 px-4 rounded-full text-sm font-medium transition-colors duration-200
                    ${
                      category.includes(vehicle)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                >
                  <Car size={16} />
                  {vehicle}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-t border-gray-100" />

          {/* Seat Capacity Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Seat Capacity</h3>
            <div className="flex flex-wrap gap-2">
              {[2, 4, 5, 7].map((seats) => (
                <button
                  key={seats}
                  onClick={() => toggleFilter(seatCapacity, setSeatCapacity, seats)}
                  className={`flex items-center gap-2 py-2 px-4 rounded-full text-sm font-medium transition-colors duration-200
                    ${
                      seatCapacity.includes(seats)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                >
                  <Users size={16} />
                  {seats} Seats
                </button>
              ))}
            </div>
          </div>

          <hr className="border-t border-gray-100" />

          {/* Features Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <div className="flex flex-wrap gap-2">
              {["WiFi", "Music System", "Recliner Seats", "AC"].map((feat) => (
                <button
                  key={feat}
                  onClick={() => toggleFilter(features, setFeatures, feat)}
                  className={`flex items-center gap-2 py-2 px-4 rounded-full text-sm font-medium transition-colors duration-200
                    ${
                      features.includes(feat)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                >
                  {getFeatureIcon(feat)}
                  {feat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side - List of Vehicles */}
      <div className="lg:col-span-3 lg:w-3/4">
        <div className="mb-4">
          <p className="text-gray-500">
            Showing <span className="font-semibold">{filterTravels.length}</span> Results
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {filterTravels.length > 0 ? (
            filterTravels.map((item, index) => (
              <TravelsItem
                key={index}
                image={item.image}
                id={item.id}
                price={item.price}
                comfort={item.comfort}
                seats={item.seats}
                name={item.name}
                onVehicleSelect={onVehicleSelect}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              <p>No vehicles match your search criteria. 😔</p>
              <p>Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filter;