import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Star, Users, MapPin, Calendar, Search, X, ChevronRight } from "lucide-react";
import axios from "axios";
import { TravelContext } from "./TravelContext";

const VehicleDetails = ({ vehicleId, onBack }) => {
  const { backendUrl, currency } = useContext(TravelContext);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      if (!vehicleId) return;
      try {
        const response = await axios.get(`${backendUrl}/vehicles/${vehicleId}`);
        setVehicle(response.data);
      } catch (err) {
        console.error("Error fetching vehicle details:", err);
        setError("Failed to load vehicle details.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [vehicleId, backendUrl]);

  if (loading) return <div className="text-center py-10">Loading vehicle details...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!vehicle) return <div className="text-center py-10">Vehicle not found.</div>;

  const mainImage = vehicle.images[0] || 'https://via.placeholder.com/600x400';
  const smallImages = vehicle.images.slice(1, 4) || [];

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button added here */}
        <div className="mb-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            <ChevronLeft size={20} className="mr-1" /> Back
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area - Vehicle Info and Image Gallery */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  {vehicle.brand}- {vehicle.model} {vehicle.year}
                </h1>
                <p className="text-sm text-gray-600 font-medium">Premium SUV | 💺 {vehicle.seating_capacity} Seats | ❄️ Air Conditioned</p>
              </div>
              <div className="flex items-center text-gray-700">
                <Star size={16} className="text-yellow-400 fill-yellow-400 mr-1" />
                <span>{vehicle.rating || 'N/A'} ({vehicle.reviews || '0'})</span>
              </div>
            </div>

            <div className="grid grid-cols-2 grid-rows-2 gap-2 rounded-xl overflow-hidden shadow-sm">
              <div className="col-span-1 row-span-2">
                <img
                  src={mainImage}
                  alt={`${vehicle.brand} ${vehicle.model} main view`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                {smallImages.map((img, index) => (
                  <div key={index} className="h-full">
                    <img
                      src={img}
                      alt={`${vehicle.brand} ${vehicle.model} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <a href="#" className="border-b-2 border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 text-sm font-medium" aria-current="page">Driver Details</a>
                <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 text-sm font-medium">Features</a>
                <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 text-sm font-medium">Reviews</a>
                <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 text-sm font-medium">Included?/Excluded</a>
                <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 text-sm font-medium">FAQs</a>
                <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 text-sm font-medium">Agreement</a>
              </nav>
            </div>
            
            <div className="py-6">
                <h2 className="text-xl font-semibold mb-2">Driver Details</h2>
                <p className="text-gray-700">Driver name and other relevant information will be available here after booking confirmation.</p>
                <div className="mt-4 flex flex-col space-y-2 text-gray-600">
                    <p>Contact number: To be provided.</p>
                    <p>License details: To be provided.</p>
                </div>
            </div>
          </div>

          {/* Right Sidebar - Fare Breakdown */}
          <div className="w-full lg:w-96">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 sticky top-8">
              <h2 className="text-xl font-bold mb-4">Fare Breakdown</h2>
              <div className="space-y-4 text-sm">
                <div className="font-semibold text-gray-800">
                  Included
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Vehicle Rent</span>
                  <span>₹ 3,500</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Driver Fee</span>
                  <span>₹ 800</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Toll Charges</span>
                  <span>₹ 200</span>
                </div>
                <hr className="my-4 border-gray-200" />
                <div className="font-semibold text-gray-800">
                  Excluded (Pay Separately)
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Fuel Cost</span>
                  <span>--.--</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Parking Fee</span>
                  <span>--.--</span>
                </div>
              </div>
              <hr className="my-6 border-gray-200" />
              <div className="flex justify-between items-center font-bold text-lg mb-2">
                <span>Total Price</span>
                <span>₹ 4500</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">Inclusive all taxes</p>
              <button
                onClick={() => alert('Proceeding to payment...')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-sm hover:bg-blue-700 transition"
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;