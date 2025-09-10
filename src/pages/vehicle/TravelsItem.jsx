import React, { useContext } from "react";
import { TravelContext } from "./TravelContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { assets } from "../../assets/assets.js";

const TravelsItem = ({ name, image, price, comfort, seats, id }) => {
  const { currency } = useContext(TravelContext);
  const navigate = useNavigate(); // Initialize useNavigate

  const comfortImages = {
    'Hatchback': assets.comfort_hatchback,
    'Sedan': assets.comfort_sedan,
    'SUV': assets.comfort_suv,
    'Luxury': assets.comfort_luxury,
    'Open Jeep': assets.comfort_jeep,
  };

  const comfortImage = comfortImages[comfort] || assets.comfort_default;

  const handleClick = () => {
    // Navigate to the vehicle details page using the vehicle's ID
    navigate(`/vehicle/${id}`);
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={handleClick} // Add the click handler here
    >
      <div className="relative w-full aspect-w-16  aspect-h-9 p-24 px-20">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transform transition-transform duration-500 ease-in-out hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{name}</h3>
        <div className="flex justify-between items-center text-sm text-gray-700">
          <span className="flex gap-2 items-center">
            <img src={comfortImage} alt={comfort} className="w-5 h-5" />
            <span className='flex items-center justify-center'>. {seats} seats</span>
          </span>
          <span className="font-semibold text-gray-900">
            {currency}
            {price} <span className="text-xs text-gray-500">/hour</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TravelsItem;