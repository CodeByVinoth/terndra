import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Star, Users, MapPin, Calendar, Search, X, ChevronRight } from "lucide-react";
import axios from "axios";
import { TravelContext } from "./TravelContext";

// --- Custom Components from User's BookingForm ---
// Helper to format time
const formatTime = (hours) => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  const ampm = h >= 12 ? "PM" : "AM";
  const formattedHours = h % 12 || 12;
  const formattedMinutes = m < 10 ? `0${m}` : m;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

// Custom Calendar and Time Picker Component
const CustomDateAndTimePicker = ({ onClose, onContinue, initialSelection }) => {
  const [dateSelection, setDateSelection] = useState(initialSelection);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const generateCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const days = [];
    const startDay = firstDayOfMonth.getDay();
    const totalDays = lastDayOfMonth.getDate();

    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    const remainingDays = 42 - days.length;
    for (let i = 0; i < remainingDays; i++) days.push(null);

    return {
      month: date.toLocaleString("default", { month: "long" }),
      year,
      days,
    };
  };

  const calendar = generateCalendar(currentMonth);

  const handleDateClick = (date) => {
    if (!date || date.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0))
      return;
    const { startDate, endDate } = dateSelection;
    if (startDate && endDate) {
      setDateSelection({ ...dateSelection, startDate: date, endDate: null });
    } else if (startDate && date.getTime() > startDate.getTime()) {
      setDateSelection({ ...dateSelection, endDate: date });
    } else if (startDate && date.getTime() < startDate.getTime()) {
      setDateSelection({ ...dateSelection, startDate: date, endDate: startDate });
    } else {
      setDateSelection({ ...dateSelection, startDate: date, endDate: null });
    }
  };

  const isSelected = (date) => {
    if (!date || !dateSelection.startDate) return false;
    const dateOnly = new Date(date.setHours(0, 0, 0, 0));
    const startOnly = new Date(dateSelection.startDate.setHours(0, 0, 0, 0));
    const endOnly = dateSelection.endDate
      ? new Date(dateSelection.endDate.setHours(0, 0, 0, 0))
      : null;
    if (endOnly) {
      return dateOnly >= startOnly && dateOnly <= endOnly;
    }
    return dateOnly.getTime() === startOnly.getTime();
  };

  const isStart = (date) =>
    date &&
    dateSelection.startDate &&
    date.setHours(0, 0, 0, 0) === dateSelection.startDate.setHours(0, 0, 0, 0);
  const isEnd = (date) =>
    date &&
    dateSelection.endDate &&
    date.setHours(0, 0, 0, 0) === dateSelection.endDate.setHours(0, 0, 0, 0);

  const handleTimeChange = (e, type) => {
    const newHours = parseFloat(e.target.value);
    const newTime = formatTime(newHours);
    setDateSelection((prev) => ({ ...prev, [type]: newTime }));
  };

  const handleContinue = () => {
    if (dateSelection.startDate && dateSelection.endDate) {
      onContinue(dateSelection);
    }
  };

  const handleReset = () => {
    setDateSelection({
      startDate: null,
      endDate: null,
      startTime: "",
      endTime: "",
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const isPastDate = (date) => {
    if (!date) return false;
    return date.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
  };

  const getCalendarDateClass = (day) => {
    const isDaySelected = isSelected(day);
    const isDayStart = isStart(day);
    const isDayEnd = isEnd(day);
    const isDayPast = isPastDate(day);
    let baseClass =
      "p-2 transition-colors duration-200 w-8 h-8 rounded-full flex items-center justify-center font-medium";
    if (!day) return "cursor-default";
    if (isDayPast) return `${baseClass} text-gray-400 cursor-not-allowed`;
    if (isDayStart && isDayEnd) return `${baseClass} bg-blue-600 text-white`;
    if (isDayStart)
      return `${baseClass} bg-blue-600 text-white rounded-r-none rounded-l-lg`;
    if (isDayEnd)
      return `${baseClass} bg-blue-600 text-white rounded-l-none rounded-r-lg`;
    if (isDaySelected)
      return `${baseClass} bg-blue-200 text-gray-800 rounded-none`;
    return `${baseClass} text-gray-800 hover:bg-gray-100`;
  };

  const getSliderValue = (timeString) => {
    if (!timeString) return 6;
    const [time, ampm] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (ampm === "PM" && hours !== 12) {
      hours += 12;
    }
    if (ampm === "AM" && hours === 12) {
      hours = 0;
    }
    return hours + minutes / 60;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg w-[500px] h-[580px] overflow-hidden p-6 flex flex-col">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div className="flex items-center text-xs font-semibold text-black">
          <Calendar size={15} className="text-gray-600 mr-1" />
          <span>
            {dateSelection.startDate?.toLocaleDateString() || "Select Start Date"} -{" "}
            {dateSelection.endDate?.toLocaleDateString() || "Select End Date"}
          </span>
        </div>
        <button
          onClick={handleReset}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          RESET
        </button>
      </div>
      <div className="flex items-center justify-center space-x-4 my-6">
        <button onClick={handlePreviousMonth} className="p-1 rounded-full hover:bg-gray-100">
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <h4 className="text-lg font-semibold text-gray-800">
          {calendar.month} {calendar.year}
        </h4>
        <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-gray-100">
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-xs text-gray-500 font-medium mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <span key={index}>{day}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 text-center text-sm flex-1">
        {calendar.days.map((day, index) => (
          <div key={index} className="flex justify-center items-center">
            <button
              onClick={() => handleDateClick(day)}
              className={getCalendarDateClass(day)}
              disabled={!day || isPastDate(day)}
            >
              {day ? day.getDate() : ""}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-800">Start Time</label>
            <span className="text-sm font-semibold text-blue-600">{dateSelection.startTime}</span>
          </div>
          <input
            type="range"
            min="6"
            max="21"
            step="0.25"
            value={getSliderValue(dateSelection.startTime)}
            onChange={(e) => handleTimeChange(e, "startTime")}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-800">End Time</label>
            <span className="text-sm font-semibold text-blue-600">{dateSelection.endTime}</span>
          </div>
          <input
            type="range"
            min="6"
            max="21"
            step="0.25"
            value={getSliderValue(dateSelection.endTime)}
            onChange={(e) => handleTimeChange(e, "endTime")}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={handleContinue}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-sm hover:bg-blue-700 transition"
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
};

// Location Picker Component
const LocationPicker = ({ onClose, onSelectLocation }) => {
  const suggestedLocations = [
    {
      name: "Majestic Bus Stand",
      details: "Kempegowda, Bengaluru, Karnataka 560009, India",
    },
    {
      name: "Yeshwanthpur, Bengaluru",
      details: "Yeshwanthpur, Bengaluru, Karnataka, India",
    },
    {
      name: "BTM Layout, Bengaluru",
      details: "BTM Layout, Bengaluru, Karnataka, India",
    },
    { name: "Bengaluru Palace", details: "Bengaluru, Karnataka, India" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl w-[800px] h-[600px] max-w-xl py-1 mx-auto overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800">
          Search for the location
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
      </div>
      <div className="px-6 pt-6 pb-4">
        <div className="relative mb-5">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for the car location"
            className="w-full p-4 pl-10 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => onSelectLocation("Current Location")}
          className="w-full text-left p-4 mb-4 rounded-lg transition-colors duration-200 hover:bg-gray-100 flex items-center gap-4 text-base font-semibold"
        >
          <MapPin size={24} className="text-blue-600" />
          <span className="text-gray-800">Current Location</span>
        </button>
        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Suggested Locations
        </h4>
        <div className="space-y-3">
          {suggestedLocations.map((location, index) => (
            <button
              key={index}
              onClick={() => onSelectLocation(location.name)}
              className="w-full text-left p-2.5 rounded-lg flex items-start gap-4 transition-colors duration-200 hover:bg-gray-100"
            >
              <MapPin size={22} className="text-gray-500 mt-1" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">
                  {location.name}
                </div>
                <div className="text-2xs text-gray-500">{location.details}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-end px-6 py-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold text-sm hover:bg-blue-700 transition"
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
};

// --- Main VehicleDetails Component ---
const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useContext(TravelContext);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  // State to manage modal visibility
  const [showCalendar, setShowCalendar] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // FIX: Robust date parsing function
  const parseDateString = (dateStr) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-');
    // Months are 0-indexed in JavaScript Date
    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? null : date;
  };

  // Get initial values from URL and set them in state
  const [destination, setDestination] = useState("");
  const [dateSelection, setDateSelection] = useState({
    startDate: null,
    endDate: null,
    startTime: "12:00 PM",
    endTime: "12:00 PM",
  });

  useEffect(() => {
    const dest = searchParams.get("destination") || "";
    const start = searchParams.get("startDate");
    const end = searchParams.get("endDate");
    const startTime = searchParams.get("startTime") || "12:00 PM";
    const endTime = searchParams.get("endTime") || "12:00 PM";

    setDestination(dest);
    setDateSelection({
      startDate: parseDateString(start),
      endDate: parseDateString(end),
      startTime,
      endTime,
    });
  }, [searchParams]);

  const fareBreakdown = {
    vehicleRent: 3500,
    driverFee: 800,
    tollCharges: 200,
    totalPrice: 4500,
  };

  useEffect(() => {
    if (!id) {
      setError("Vehicle ID is missing from the URL.");
      setLoading(false);
      return;
    }

    const fetchVehicleDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/vehicles/${id}`);
        if (response.data) {
          setVehicle(response.data);
          setLoading(false);
        } else {
          setError("Vehicle not found.");
          setLoading(false);
        }
      } catch (err) {
        console.error("API call error:", err);
        setError("Error fetching vehicle details. Please check the backend server and ID format.");
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [id, backendUrl]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleUpdateSearch = () => {
    // Create a new URLSearchParams object from the current state
    const newSearchParams = new URLSearchParams({
      destination: destination,
      startDate: dateSelection.startDate?.toISOString().slice(0, 10) || '',
      endDate: dateSelection.endDate?.toISOString().slice(0, 10) || '',
      startTime: dateSelection.startTime,
      endTime: dateSelection.endTime,
    }).toString();

    // Navigate to the same route with the new search parameters
    navigate(`?${newSearchParams}`, { replace: true });
    console.log("Search updated with:", { destination, ...dateSelection });
  };

  const handleProceedToPay = () => {
    console.log("Proceed to Pay clicked!");
  };

  // Correctly updates the dateSelection state and closes the modal
  const handleDateAndTimeContinue = (newSelection) => {
    setDateSelection(newSelection);
    setShowCalendar(false);
  };

  const handleLocationSelect = (location) => {
    setDestination(location);
    setShowLocationPicker(false);
  };

  if (loading) {
    return <div className="text-center py-10">Loading vehicle details...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
        <button onClick={handleGoBack} className="mt-4 text-blue-600 underline">
          Go back
        </button>
      </div>
    );
  }

  if (!vehicle) {
    return <div className="text-center py-10">No vehicle data available.</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 lg:p-10 my-8">
        <button onClick={handleGoBack} className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors">
          <ChevronLeft size={20} className="mr-1" />
          Back
        </button>

        <div className="bg-white shadow-md rounded-xl p-4 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 min-w-[150px] flex items-center gap-2 cursor-pointer" onClick={() => setShowLocationPicker(true)}>
              <MapPin size={16} className="text-gray-500" />
              <span className="text-sm text-gray-700 font-medium truncate">
                {destination || 'Your Destination'}
              </span>
            </div>
            <div className="flex-1 min-w-[150px] flex items-center gap-2 cursor-pointer" onClick={() => setShowCalendar(true)}>
              <Calendar size={16} className="text-gray-500" />
              <span className="text-sm text-gray-700 font-medium">
                {dateSelection.startDate ? dateSelection.startDate.toLocaleDateString() : 'dd-mm-yyyy'}
              </span>
            </div>
            <div className="flex-1 min-w-[150px] flex items-center gap-2 cursor-pointer" onClick={() => setShowCalendar(true)}>
              <Calendar size={16} className="text-gray-500" />
              <span className="text-sm text-gray-700 font-medium">
                {dateSelection.endDate ? dateSelection.endDate.toLocaleDateString() : 'dd-mm-yyyy'}
              </span>
            </div>
            <button
              onClick={handleUpdateSearch}
              className="bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center min-w-[100px] text-sm font-semibold hover:bg-blue-700 transition"
            >
              Search
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-lg overflow-hidden mb-6">
              <img
                src={vehicle.images?.[0] || "https://via.placeholder.com/800x450"}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-auto object-cover"
              />
              <div className="p-4 flex gap-2 overflow-x-auto">
                {vehicle.images?.slice(1).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${vehicle.brand} preview ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {vehicle.brand} - {vehicle.model}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 font-medium mt-1">
                    <span className="mr-2">{vehicle.type}</span> •
                    <div className="flex items-center mx-2">
                      <Star size={14} className="text-yellow-400 mr-1" />
                      <span>{vehicle.rating} ({vehicle.reviews})</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                  <span className="p-1 rounded-full border border-blue-600">
                    <Users size={16} />
                  </span>
                  {vehicle.seating_capacity} Seats
                </div>
              </div>
              <div className="text-base text-gray-600">
                <p>Features and details about the vehicle...</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6 border border-gray-200 h-fit">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Fare Breakdown</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center text-gray-600 font-medium">
                <span>Vehicle Rent</span>
                <span className="font-semibold text-gray-800">₹ {fareBreakdown.vehicleRent}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600 font-medium">
                <span>Driver Fee</span>
                <span className="font-semibold text-gray-800">₹ {fareBreakdown.driverFee}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600 font-medium">
                <span>Toll Charges</span>
                <span className="font-semibold text-gray-800">₹ {fareBreakdown.tollCharges}</span>
              </div>
              <div className="border-t border-dashed border-gray-300 my-4 pt-3">
                <p className="text-gray-500 font-medium mb-2">Excluded (Pay Separately)</p>
                <div className="flex justify-between items-center text-gray-600 font-medium">
                  <span>Fuel Cost</span>
                  <span className="text-gray-400">--</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 font-medium">
                  <span>Parking Fee</span>
                  <span className="text-gray-400">--</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center font-bold text-lg mb-4">
                <span>Total Price</span>
                <span>₹ {fareBreakdown.totalPrice}</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">Inclusive all taxes</p>
              <button
                onClick={handleProceedToPay}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-sm hover:bg-blue-700 transition"
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCalendar && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-9"
          onClick={() => setShowCalendar(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <CustomDateAndTimePicker
              initialSelection={dateSelection}
              onClose={() => setShowCalendar(false)}
              onContinue={handleDateAndTimeContinue}
            />
          </div>
        </div>
      )}

      {showLocationPicker && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => setShowLocationPicker(false)}>
          <LocationPicker
            onClose={() => setShowLocationPicker(false)}
            onSelectLocation={handleLocationSelect}
          />
        </div>
      )}
    </div>
  );
};

export default VehicleDetails;