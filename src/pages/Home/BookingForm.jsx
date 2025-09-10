import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Helper to format time
const formatTime = (hours) => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  const ampm = h >= 12 ? "PM" : "AM";
  const formattedHours = h % 12 || 12;
  const formattedMinutes = m < 10 ? `0${m}` : m;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

// Calendar Component
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

// Main Component (BookingForm)
const BookingForm = ({ setBookingFormData }) => {
  const [tripType, setTripType] = useState("single");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [activeLocationField, setActiveLocationField] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [dateSelection, setDateSelection] = useState({
    startDate: new Date(),
    endDate: new Date(),
    startTime: "",
    endTime: "",
  });

  const [formData, setFormData] = useState({
    destination: "",
    pickuppoint: "",
    droppoint: "",
    passangercount: "",
    tripbookingtype: tripType,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (formData.destination === "") {
      validationErrors.destination = "Select your Destination";
    }
    if (formData.pickuppoint === "") {
      validationErrors.pickuppoint = "Select your Pickup Location";
    }
    if (formData.droppoint === "") {
      validationErrors.droppoint = "Select your droppoint";
    }
    if (formData.passangercount === "") {
      validationErrors.passangercount = "Select passangercount";
    }

    if (
      formData.pickuppoint &&
      formData.droppoint &&
      formData.pickuppoint === formData.droppoint
    ) {
      validationErrors.droppoint = "Pickup and Drop location cannot be the same";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const finalFormData = {
        pickuppoint: formData.pickuppoint,
        droppoint: formData.droppoint,
        passangercount: formData.passangercount,
        tripDates: dateSelection,
      };
      setBookingFormData(finalFormData);
      navigate("/vehicle", { state: { bookingFormData: finalFormData } });
    }
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
      setFormData({ ...formData, pickuppoint: location });
      if (errors.pickuppoint) {
        setErrors({ ...errors, pickuppoint: "" });
      }
    } else if (activeLocationField === "drop") {
      setFormData({ ...formData, droppoint: location });
      if (errors.droppoint) {
        setErrors({ ...errors, droppoint: "" });
      }
    }
    setShowLocationPicker(false);
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="bg-white rounded-xl p-7 w-[500px] shadow-md relative mx-auto mt-0">
      <h3 className="text-center pb-3 text-lg font-semibold text-black">
        Your Trip, Our Responsibility
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="block text-sm mb-1">Enter Destination</label>
          <div className="bg-gray-100 flex items-center gap-2 p-3 rounded-lg">
            <MapPin size={16} className="text-gray-500" />
            <input
              type="text"
              className="bg-transparent flex-1 text-sm outline-none"
              placeholder="Destination"
              value={formData.destination}
              onChange={(e) => handleChange("destination", e.target.value)}
            />
          </div>
          {errors.destination && (
            <p className="text-red-500 text-xs mt-1">{errors.destination}</p>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1">Trip Dates</label>
          <div
            className="bg-gray-100 p-3 rounded-lg flex items-center gap-2 cursor-pointer"
            onClick={() => setShowCalendar(true)}
          >
            <Calendar size={16} className="text-gray-500" />
            <span className="text-sm">
              {dateSelection.startDate
                ? dateSelection.startDate?.toLocaleDateString()
                : "Select Start Date"}{" "}
              -{" "}
              {dateSelection.endDate
                ? dateSelection.endDate?.toLocaleDateString()
                : "Select End Date"}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="block text-sm mb-1">Pickup & Drop location</label>
          <div className="flex gap-3">
            <div className="flex-1 flex flex-col">
              <input
                type="text"
                placeholder="Pickup Point"
                className="bg-gray-100 flex-1 p-3 rounded-lg text-sm cursor-pointer"
                value={formData.pickuppoint}
                readOnly
                onClick={() => handleLocationClick("pickup")}
              />
              {errors.pickuppoint && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.pickuppoint}
                </p>
              )}
            </div>
            <div className="flex-1 flex flex-col">
              <input
                type="text"
                placeholder="Drop Point"
                className="bg-gray-100 flex-1 p-3 rounded-lg text-sm cursor-pointer"
                value={formData.droppoint}
                readOnly
                onClick={() => handleLocationClick("drop")}
              />
              {errors.droppoint && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.droppoint}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex rounded-lg overflow-hidden border">
          <button
            type="button"
            onClick={() => {
              setTripType("single");
              handleChange("tripbookingtype", "single");
            }}
            className={`flex-1 py-3 text-sm transition ${
              tripType === "single"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-800"
            }`}
          >
            Single
          </button>
          <button
            type="button"
            onClick={() => {
              setTripType("round");
              handleChange("tripbookingtype", "round");
            }}
            className={`flex-1 py-3 text-sm transition ${
              tripType === "round"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-800"
            }`}
          >
            Round
          </button>
        </div>
        <div className="flex items-center bg-gray-100 p-3 rounded-lg gap-2">
          <Users size={16} className="text-gray-500" />
          <input
            type="number"
            min="1"
            placeholder="Enter number of passengers"
            className="w-full bg-transparent text-sm outline-none"
            value={formData.passangercount}
            onChange={(e) => handleChange("passangercount", e.target.value)}
          />
        </div>
        {errors.passangercount && (
          <span className="text-red-500 text-xs mt-1">
            {errors.passangercount}
          </span>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white text-sm py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Start Trip
        </button>
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

export default BookingForm;