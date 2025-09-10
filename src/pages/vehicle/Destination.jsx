import React, { useState } from "react";
import "react-calendar/dist/Calendar.css";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { assets } from "../../assets/assets.js";

// Helper to format time (copied from BookingForm)
const formatTime = (hours) => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  const ampm = h >= 12 ? "PM" : "AM";
  const formattedHours = h % 12 || 12;
  const formattedMinutes = m < 10 ? `0${m}` : m;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

// CustomDateAndTimePicker component (copied from BookingForm)
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
            {initialSelection.startDate?.toLocaleDateString() || "Select Start Date"} -{" "}
            {initialSelection.endDate?.toLocaleDateString() || "Select End Date"}
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

// Location Picker
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


// Main Destination Component
const Destination = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingFormData = location.state?.bookingFormData || {};
  
  const {
    pickuppoint,
    droppoint,
    passangercount,
    tripDates,
  } = bookingFormData;

  // State for the editable fields, initialized with data from props or defaults
  const [pickupInput, setPickupInput] = useState(pickuppoint || "");
  const [dropInput, setDropInput] = useState(droppoint || "");
  const [passengersInput, setPassengersInput] = useState(passangercount || "");
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [activeLocationField, setActiveLocationField] = useState(null);

  // State for the dates
  const [dateSelection, setDateSelection] = useState({
    startDate: tripDates?.startDate ? new Date(tripDates.startDate) : null,
    endDate: tripDates?.endDate ? new Date(tripDates.endDate) : null,
    startTime: tripDates?.startTime || "6:00 AM",
    endTime: tripDates?.endTime || "6:00 PM",
  });
  const [showCalendar, setShowCalendar] = useState(false);

  // Helper function to format date for display
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Handle form submission to trigger a new search
  const handleSubmit = (e) => {
    e.preventDefault();
    const newBookingData = {
      pickuppoint: pickupInput,
      droppoint: dropInput,
      passangercount: passengersInput,
      tripDates: dateSelection,
    };
    // Navigate back to the main search page with the new data
    navigate("/", { state: { bookingFormData: newBookingData } });
  };

  const handleDateAndTimeContinue = (newSelection) => {
    setDateSelection(newSelection);
    setShowCalendar(false);
  };

  const handleLocationClick = (field) => {
    setActiveLocationField(field);
    setShowLocationPicker(true);
  };

  const handleLocationSelect = (location) => {
    if (activeLocationField === "pickup") {
      setPickupInput(location);
    } else if (activeLocationField === "drop") {
      setDropInput(location);
    }
    setShowLocationPicker(false);
  };

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 lg:p-10 mb-8">
      {/* Trip Details Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
        <div className="w-full">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
            Find Your Perfect Vehicle
          </h2>
          <div className="text-sm text-gray-600 font-medium">
            <span className="font-semibold text-gray-800">
              {pickupInput || "N/A"}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-800">
              {dropInput || "N/A"}
            </span>
            <span className="mx-2">•</span>
            <span className="font-semibold text-gray-800">
              {formatDate(dateSelection.startDate)} -{" "}
              {formatDate(dateSelection.endDate)}
            </span>
            <span className="mx-2">•</span>
            <span className="font-semibold text-gray-800">
              {passengersInput}
            </span>{" "}
            Passengers
          </div>
        </div>
      </div>
      <hr className="my-6 border-gray-200" />
      {/* Editable Search Bar Section */}
      <form onSubmit={handleSubmit} className="w-full p-4 lg:p-0">
        <div className="relative flex flex-col md:flex-row items-center bg-gray-100 rounded-2xl px-5 py-3 shadow-md gap-4">
          {/* Pickup and Drop Point Inputs */}
          <div
            className="flex-1 w-full flex items-center gap-2 cursor-pointer"
            onClick={() => handleLocationClick("pickup")}
          >
            <MapPin size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Pickup Point"
              value={pickupInput}
              readOnly
              className="w-full bg-transparent outline-none text-gray-900 text-sm xl:font-medium cursor-pointer"
            />
          </div>
          <div
            className="flex-1 w-full flex items-center gap-2 cursor-pointer"
            onClick={() => handleLocationClick("drop")}
          >
            <MapPin size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Drop Point"
              value={dropInput}
              readOnly
              className="w-full bg-transparent outline-none text-gray-900 text-sm xl:font-medium cursor-pointer"
            />
          </div>

          {/* Passenger Count Input */}
          <div className="flex-1 w-full flex items-center gap-2">
            <Users size={16} className="text-gray-500" />
            <input
              type="number"
              placeholder="No. of Passengers"
              min="1"
              value={passengersInput}
              onChange={(e) => setPassengersInput(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-900 text-sm xl:font-medium"
            />
          </div>

          {/* Calendar button */}
          <div
            className="flex-1 flex items-center gap-2 cursor-pointer"
            onClick={() => setShowCalendar(true)}
          >
            <Calendar size={16} className="text-gray-500" />
            <p className="text-gray-900 text-sm xl:font-medium">
              {dateSelection.startDate
                ? `${formatDate(dateSelection.startDate)}`
                : "Start Date"}{" "}
              -{" "}
              {dateSelection.endDate
                ? `${formatDate(dateSelection.endDate)}`
                : "End Date"}
            </p>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="flex items-center justify-center bg-blue-600 text-white rounded-full p-3 w-12 h-12"
          >
            <Search size={24} className="text-white" />
          </button>
        </div>
      </form>
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
          onClick={() => setShowLocationPicker(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <LocationPicker
              onClose={() => setShowLocationPicker(false)}
              onSelectLocation={handleLocationSelect}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Destination;