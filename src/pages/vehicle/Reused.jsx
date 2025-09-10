import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";

// ---------- Custom Calendar Component ----------
export const CustomDateAndTimePicker = ({ onClose, onContinue, initialSelection }) => {
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

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }
    for (let i = 1; i <= totalDays; i++) {
      const dayDate = new Date(year, month, i);
      const isSelected = dateSelection.start && dayDate.getTime() === dateSelection.start.getTime();
      const isSelectedEnd = dateSelection.end && dayDate.getTime() === dateSelection.end.getTime();
      const isHovered = dateSelection.start && dateSelection.end && dayDate > dateSelection.start && dayDate < dateSelection.end;
      const isRange = dateSelection.start && dateSelection.end && dayDate >= dateSelection.start && dayDate <= dateSelection.end;

      const dayClasses = `h-8 w-8 flex items-center justify-center text-sm font-medium rounded-full cursor-pointer transition-colors duration-200
        ${isSelected || isSelectedEnd ? 'bg-blue-600 text-white' : ''}
        ${!isSelected && !isSelectedEnd && !isRange ? 'hover:bg-blue-100' : ''}
        ${isRange && 'bg-blue-200 text-blue-800'}`;

      const handleDayClick = () => {
        if (!dateSelection.start || (dateSelection.start && dateSelection.end)) {
          setDateSelection({ start: dayDate, end: null });
        } else if (dayDate < dateSelection.start) {
          setDateSelection({ start: dayDate, end: dateSelection.start });
        } else {
          setDateSelection({ ...dateSelection, end: dayDate });
        }
      };

      days.push(
        <div key={i} className={dayClasses} onClick={handleDayClick}>
          {i}
        </div>
      );
    }
    return days;
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  const prevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleContinue = () => {
    if (dateSelection.start) {
      onContinue(dateSelection);
    } else {
      alert("Please select a date range.");
    }
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-lg font-semibold">
          {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
        </h3>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-gray-500 font-medium text-sm mb-2">
        {daysOfWeek.map(day => <div key={day}>{day}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {generateCalendar(currentMonth)}
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-200 transition">Cancel</button>
        <button onClick={handleContinue} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Continue</button>
      </div>
    </div>
  );
};

// ---------- Location Picker Component ----------
export const LocationPicker = ({ onClose, onSelectLocation }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      const mockPlaces = [
        "Pallipalayam, Tamil Nadu", "Tiruchengode, Tamil Nadu", "Erode, Tamil Nadu",
        "Karur, Tamil Nadu", "Salem, Tamil Nadu", "Namakkal, Tamil Nadu"
      ].filter(place => place.toLowerCase().includes(searchTerm.toLowerCase()));
      setPlaces(mockPlaces);
    };
    const handler = setTimeout(() => {
      fetchPlaces();
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleSelect = (place) => {
    onSelectLocation(place);
    onClose();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Search Location</h3>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={20} /></button>
      </div>
      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search for a location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="max-h-60 overflow-y-auto">
        {places.length > 0 ? (
          places.map((place, index) => (
            <div key={index} className="py-2 px-4 cursor-pointer hover:bg-gray-100 rounded-lg" onClick={() => handleSelect(place)}>
              {place}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No results found</p>
        )}
      </div>
    </div>
  );
};