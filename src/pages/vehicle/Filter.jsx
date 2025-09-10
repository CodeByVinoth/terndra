import { useContext, useEffect, useState } from "react";
import TravelsItem from "./TravelsItem";
import { TravelContext } from "./TravelContext";
import { assets } from "../../assets/assets.js";

const Filter = () => {
  const [openVehicle, setOpenVehicle] = useState(false);
  const [openSeat, setOpenSeat] = useState(false);
  const [openFeatures, setOpenFeatures] = useState(false);
  const [filterTravels, setFilterTravels] = useState([]);
  const [category, setCategory] = useState([]);
  const [seatCapacity, setSeatCapacity] = useState([]);
  const [features, setFeatures] = useState([]);
  const [price, setPrice] = useState(3600);
  const { currency, products } = useContext(TravelContext);

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSeatCapacity = (e) => {
    const value = Number(e.target.value);
    if (seatCapacity.includes(value)) {
      setSeatCapacity((prev) => prev.filter((item) => item !== value));
    } else {
      setSeatCapacity((prev) => [...prev, value]);
    }
  };

  const toggleFeatures = (e) => {
    if (features.includes(e.target.value)) {
      setFeatures((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setFeatures((prev) => [...prev, e.target.value]);
    }
  };

  // ------------------ Core Filtering Logic ------------------
  useEffect(() => {
    let filteredList = products;

    // Filter by Category
    if (category.length > 0) {
      filteredList = filteredList.filter((item) => category.includes(item.comfort));
    }

    // Filter by Seating Capacity
    if (seatCapacity.length > 0) {
      filteredList = filteredList.filter((item) => seatCapacity.includes(item.seats));
    }

    // Filter by Features
    if (features.length > 0) {
      filteredList = filteredList.filter((item) =>
        features.every((feat) => item.features?.includes(feat))
      );
    }
    
    // Filter by Price
    filteredList = filteredList.filter((item) => item.price <= price);

    setFilterTravels(filteredList);
  }, [category, seatCapacity, features, price, products]);
  // -----------------------------------------------------------

  return (
    <div className="flex flex-col lg:flex-row gap-8 ">
      {/* Left side - Filters */}
      <div className="lg:w-1/4 bg-white shadow-md rounded-xl p-4 md:p-6 h-fit">
        {/* Price Slider */}
        <div className="mb-6">
          <h2 className="font-semibold text-lg md:text-xl mb-3">Price Range</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 text-sm">{currency}0</span>
            <span className="font-semibold text-lg">{currency}{price}</span>
          </div>
          <input
            type="range"
            min="0"
            max="3600"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Vehicle Type Filter */}
        <div className="mb-6">
          <h2
            onClick={() => setOpenVehicle(!openVehicle)}
            className="flex items-center justify-between cursor-pointer text-sm md:text-base"
          >
            Vehicle Type
            <img
              src={openVehicle ? assets.arrowup : assets.arrowdown}
              alt="toggle icon"
              className="w-6 h-3"
            />
          </h2>
          {openVehicle && (
            <div className="flex flex-col gap-2 mt-3">
              {["Hatchback", "Sedan", "SUV", "Luxury", "Open Jeep"].map((vType) => (
                <label key={vType} className="flex gap-2 text-sm md:text-base">
                  <input
                    type="checkbox"
                    value={vType}
                    onChange={toggleCategory}
                  />
                  {vType}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Seat Capacity Filter */}
        <div className="mb-6">
          <h2
            onClick={() => setOpenSeat(!openSeat)}
            className="flex items-center justify-between cursor-pointer text-sm md:text-base"
          >
            Seats
            <img
              src={openSeat ? assets.arrowup : assets.arrowdown}
              alt="toggle icon"
              className="w-6 h-3"
            />
          </h2>
          {openSeat && (
            <div className="flex flex-col gap-2 mt-3">
              {[4, 5, 7, 9, 12].map((sCount) => (
                <label key={sCount} className="flex gap-2 text-sm md:text-base">
                  <input
                    type="checkbox"
                    value={sCount}
                    onChange={toggleSeatCapacity}
                  />
                  {sCount} Seats
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Features Filter */}
        <div className="mb-6">
          <h2
            onClick={() => setOpenFeatures(!openFeatures)}
            className="flex items-center justify-between cursor-pointer text-sm md:text-base"
          >
            Features
            <img
              src={openFeatures ? assets.arrowup : assets.arrowdown}
              alt="toggle icon"
              className="w-6 h-3"
            />
          </h2>
          {openFeatures && (
            <div className="flex flex-col gap-2 mt-3">
              {["WiFi", "Music System", "Recliner Seats", "AC"].map((feat) => (
                <label key={feat} className="flex gap-2 text-sm md:text-base">
                  <input
                    type="checkbox"
                    value={feat}
                    onChange={toggleFeatures}
                  />
                  {feat}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right side - List / Travelers */}
      <div className="lg:col-span-3 lg:w-3/4">
        <div className="my-4">
          <p className="text-gray-400">Showing {filterTravels.length} Results</p>
          <hr className="border-r" />
        </div>

        {/* Grid for cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3  gap-8">
          {filterTravels.map((item, index) => (
            <TravelsItem
              key={index}
              image={item.image}
              id={item.id}
              price={item.price}
              comfort={item.comfort}
              seats={item.seats}
              name={item.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filter;