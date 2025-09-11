import React, { useState, useContext } from "react";
import GoogleLogo from "../../assets/google.png";
import LoginBg from "../../assets/login.png";
import axios from "axios";
import { TravelContext } from "../../pages/vehicle/TravelContext";
import { useGoogleLogin } from '@react-oauth/google';

const LoginForm = ({ onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const { setToken, backendUrl } = useContext(TravelContext);

  const handleOverlayClick = (e) => {
    if (e.target.id === "overlay") {
      onClose();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(`${backendUrl}/users/signin`, {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        onClose();
      } else {
        setError("Login failed. " + response.data.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/users/signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201) {
        alert("Account created successfully! Please sign in.");
        setIsSignUp(false);
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      } else {
        setError("Sign-up failed. " + response.data.error);
      }
    } catch (err) {
      console.error("Sign-up error:", err);
      if (err.response && err.response.data.error === "Email already registered") {
        setError("This email is already registered. Please sign in or use a different email.");
      } else {
        setError("An error occurred during sign-up. Please try again.");
      }
    }
  };

  // 🆕 Google Login Hook
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              'Authorization': `Bearer ${tokenResponse.access_token}`
            }
          }
        );

        // Here, send the user data to your backend for authentication/registration
        const googleUserData = res.data;
        console.log('User info from Google:', googleUserData);

        // Determine if it's a sign-in or sign-up request to your backend
        // This is a crucial step to handle Google-based authentication on your server
        const backendResponse = await axios.post(`${backendUrl}/users/google-auth`, {
          email: googleUserData.email,
          name: googleUserData.name,
          googleId: googleUserData.sub,
        });

        if (backendResponse.data.success) {
          setToken(backendResponse.data.token);
          localStorage.setItem("token", backendResponse.data.token);
          localStorage.setItem("user", JSON.stringify(backendResponse.data.user));
          onClose();
        } else {
          setError("Google authentication failed.");
        }
      } catch (error) {
        console.error('Error during Google sign-in:', error);
        setError("An error occurred during Google sign-in. Please try again.");
      }
    },
    onError: errorResponse => {
      console.log('Google Sign-In Failed:', errorResponse);
      setError('Google Sign-In Failed. Please try again.');
    },
  });

  return (
    <div
      id="overlay"
      onClick={handleOverlayClick}
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
    >
      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden w-[95%] sm:w-[700px] lg:w-[900px] min-h-[600px] mx-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-4xl z-50"
        >
          &times;
        </button>

        {isForgot ? (
          <div
            className="absolute inset-0 flex items-center justify-center p-4"
            style={{ backgroundImage: `url(${LoginBg})` }}
          >
            <div className="bg-black/70 backdrop-blur-md rounded-2xl p-6 sm:p-10 w-full max-w-sm text-center text-white shadow-2xl">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">Reset Password</h1>
              <p className="text-sm sm:text-lg mb-6">
                Enter your email address to get a password reset link.
              </p>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className="bg-white/20 text-white placeholder-white/50 px-5 py-3 w-full rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex mt-6 justify-between">
                <button
                  type="button"
                  onClick={() => setIsForgot(false)}
                  className="rounded-full border border-gray-300 text-white px-6 py-2 uppercase hover:bg-gray-700 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  className="rounded-full border border-blue-500 bg-blue-500 text-white px-6 py-2 uppercase hover:bg-blue-600 transition"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="sm:hidden w-[400px] px-10 py-10">
              <div className="flex justify-center mb-8">
                <button
                  onClick={() => setIsSignUp(false)}
                  className={`py-2 px-6 font-semibold transition-colors duration-300 ${
                    !isSignUp ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsSignUp(true)}
                  className={`py-2 px-6 font-semibold transition-colors duration-300 ${
                    isSignUp ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {isSignUp ? (
                <form className="flex flex-col items-center justify-center text-center" onSubmit={handleSignUp}>
                  <h1 className="font-bold text-3xl mb-4">Create Account</h1>
                  {/* 🆕 Google Sign-Up Button */}
                  <button
                    type="button"
                    onClick={() => googleLogin()}
                    className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-3 my-2 hover:bg-gray-100 transition"
                  >
                    <img src={GoogleLogo} alt="Google Logo" className="w-6 h-6 mr-2" />
                    Sign up with Google
                  </button>
                  <span className="text-sm text-gray-500 my-4">or use your email for registration</span>
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    className="bg-gray-100 px-5 py-3 my-2 w-full rounded-lg text-base"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className="bg-gray-100 px-5 py-3 my-2 w-full rounded-lg text-base"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className="bg-gray-100 px-5 py-3 my-2 w-full rounded-lg text-base"
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className="bg-gray-100 px-5 py-3 my-2 w-full rounded-lg text-base"
                  />
                  {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
                  <button
                    type="submit"
                    className="mt-6 w-full rounded-full border border-blue-500 bg-blue-500 text-white text-base font-bold px-10 py-3 uppercase hover:bg-blue-600 transition"
                  >
                    Sign Up
                  </button>
                </form>
              ) : (
                <form className="flex flex-col items-center justify-center text-center" onSubmit={handleSignIn}>
                  <h1 className="font-bold text-3xl mb-4">Sign In</h1>
                  {/* 🆕 Google Sign-In Button */}
                  <button
                    type="button"
                    onClick={() => googleLogin()}
                    className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-3 my-2 hover:bg-gray-100 transition"
                  >
                    <img src={GoogleLogo} alt="Google Logo" className="w-6 h-6 mr-2" />
                    Sign in with Google
                  </button>
                  <span className="text-sm text-gray-500 my-4">or use your account</span>
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className="bg-gray-100 px-5 py-3 my-2 w-full rounded-lg text-base"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    className="bg-gray-100 px-5 py-3 my-2 w-full rounded-lg text-base"
                  />
                  {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
                  <button
                    type="button"
                    onClick={() => setIsForgot(true)}
                    className="text-gray-600 text-sm mt-3 underline hover:text-blue-500"
                  >
                    Forgot your password?
                  </button>
                  <button
                    type="submit"
                    className="mt-6 w-full rounded-full border border-blue-500 bg-blue-500 text-white text-base font-bold px-10 py-3 uppercase hover:bg-blue-600 transition"
                  >
                    Sign In
                  </button>
                </form>
              )}
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block">
              {/* Sign Up Panel */}
              <div
                className={`absolute top-0 left-0 h-full w-full sm:w-1/2 flex flex-col items-center justify-center transition-all duration-700 ${
                  isSignUp ? "sm:translate-x-full opacity-100 z-20" : "opacity-0 z-10"
                }`}
              >
                <form className="bg-white flex flex-col items-center justify-center px-8 sm:px-14 h-full text-center" onSubmit={handleSignUp}>
                  <h1 className="font-bold text-3xl">Create Account</h1>
                  {/* 🆕 Google Sign-Up Button */}
                  <button
                    type="button"
                    onClick={() => googleLogin()}
                    className="flex items-center justify-center w-[300px] border border-gray-300 rounded-lg py-2 my-4 hover:bg-gray-100 transition"
                  >
                    <img src={GoogleLogo} alt="Google Logo" className="w-8 h-8 mr-2" />
                    Sign up with Google
                  </button>
                  <span className="text-base mb-3">or use your email for registration</span>
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    className="bg-gray-200 px-5 py-2 my-2 w-[300px] rounded text-base"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className="bg-gray-200 px-5 py-2 my-2 w-[300px] rounded text-base"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className="bg-gray-200 px-5 py-2 my-2 w-[300px] rounded text-base"
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className="bg-gray-200 px-5 py-2 my-2 w-[300px] rounded text-base"
                  />
                  {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
                  <button type="submit" className="mt-4 rounded-full border border-blue-500 bg-blue-500 text-white text-sm sm:text-base font-bold px-10 py-3 uppercase hover:bg-blue-600 transition">
                    Sign Up
                  </button>
                </form>
              </div>

              {/* Sign In Panel */}
              <div
                className={`absolute top-0 left-0 h-full w-full sm:w-1/2 flex flex-col items-center justify-center transition-all duration-700 ${
                  isSignUp ? "sm:translate-x-full opacity-0 z-10" : "opacity-100 z-20"
                }`}
              >
                <form className="bg-white flex flex-col items-center justify-center px-8 sm:px-14 h-full text-center" onSubmit={handleSignIn}>
                  <h1 className="font-bold text-3xl">Sign In</h1>
                  {/* 🆕 Google Sign-In Button */}
                  <button
                    type="button"
                    onClick={() => googleLogin()}
                    className="flex items-center justify-center w-[300px] border border-gray-300 rounded-lg py-2 my-4 hover:bg-gray-100 transition"
                  >
                    <img src={GoogleLogo} alt="Google Logo" className="w-8 h-8 mr-2" />
                    Sign in with Google
                  </button>
                  <span className="text-base mb-3">or use your account</span>
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className="bg-gray-200 px-5 py-2 my-2 w-[300px] rounded text-base"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    className="bg-gray-200 px-5 py-2 my-2 w-[300px] rounded text-base"
                  />
                  {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
                  <button
                    type="button"
                    onClick={() => setIsForgot(true)}
                    className="text-gray-600 text-sm mt-3 underline"
                  >
                    Forgot your password?
                  </button>
                  <button type="submit" className="mt-4 rounded-full border border-blue-500 bg-blue-500 text-white text-sm sm:text-base font-bold px-10 py-3 uppercase hover:bg-blue-600 transition">
                    Sign In
                  </button>
                </form>
              </div>

              {/* Overlay Panel */}
              <div
                className={`absolute top-0 left-0 sm:left-1/2 w-full sm:w-1/2 h-full overflow-hidden transition-transform duration-700 z-30 ${
                  isSignUp ? "sm:-translate-x-full" : ""
                }`}
              >
                <div
                  className={`relative left-[-100%] h-full w-[200%] flex transition-transform duration-700 ${
                    isSignUp ? "translate-x-1/2" : "translate-x-0"
                  }`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${LoginBg})` }}
                  ></div>

                  <div className="relative w-1/2 h-full flex flex-col items-center justify-center px-8 sm:px-12 text-center text-white">
                    <div className="bg-black/40 p-6 rounded-2xl">
                      <h1 className="text-3xl sm:text-4xl font-bold">Welcome Back!</h1>
                      <p className="text-base sm:text-lg my-5">
                        To keep connected with us please login with your personal info
                      </p>
                      <button
                        onClick={() => setIsSignUp(false)}
                        className="mt-4 rounded-full border border-white text-white text-sm sm:text-base font-bold px-10 py-3 uppercase hover:bg-white hover:text-blue-500 transition"
                      >
                        Sign In
                      </button>
                    </div>
                  </div>

                  <div className="relative w-1/2 h-full flex flex-col items-center justify-center px-8 sm:px-12 text-center text-white">
                    <div className="bg-black/40 p-6 rounded-2xl">
                      <h1 className="text-3xl sm:text-4xl font-bold">Hello, Friend!</h1>
                      <p className="text-base sm:text-lg my-5">
                        Enter your personal details and start your journey with us
                      </p>
                      <button
                        onClick={() => setIsSignUp(true)}
                        className="mt-4 rounded-full border border-white text-white text-sm sm:text-base font-bold px-10 py-3 uppercase hover:bg-white hover:text-blue-500 transition"
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginForm;