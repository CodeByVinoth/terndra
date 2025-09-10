import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home/Home";
import LoginForm from "./pages/Home/LoginForm";
import { ViewCar } from "./pages/vehicle/ViewCar";
import VehicleDetails from "./pages/vehicle/VehicleDetails";
import UserProfile from "./pages/Home/UserProfile.jsx";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({});

  return (
    <Router>
      <div className="min-h-screen flex flex-col relative">
        <Header onLoginClick={() => setShowLogin(true)} />

        <main id="main-content" className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={<Home setBookingFormData={setBookingFormData} />}
            />
            <Route
              path="/vehicle"
              element={<ViewCar bookingFormData={bookingFormData} />}
            />
            <Route path="/vehicle/:id" element={<VehicleDetails />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </main>

        <Footer />

        {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
      </div>
    </Router>
  );
}

export default App;
