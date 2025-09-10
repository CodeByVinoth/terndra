import React, { useContext, useEffect, useState } from "react";
import { TravelContext } from "../../pages/vehicle/TravelContext";
import {
  LogOut,
  User,
  Mail,
  Calendar,
  Edit,
  Save,
  X,
  Phone,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

// List of common country codes
const countryCodes = [
  { code: "+1", name: "USA" },
  { code: "+44", name: "UK" },
  { code: "+91", name: "India" },
  { code: "+61", name: "Australia" },
  { code: "+81", name: "Japan" },
  { code: "+49", name: "Germany" },
  { code: "+33", name: "France" },
  { code: "+86", name: "China" },
  { code: "+7", name: "Russia" },
];

// 🎨 Cloudinary Configuration for Direct Unsigned Upload
// NOTE: Your API Key and Secret should NEVER be in frontend code.
// The upload preset must be configured as "Unsigned" in your Cloudinary dashboard.
const CLOUDINARY_UPLOAD_PRESET = "terndra";
const CLOUDINARY_CLOUD_NAME = "djl2vqfb5";

const UserProfile = () => {
  const { logout } = useContext(TravelContext);
  const [user, setUser] = useState(null);
  const [editUser, setEditUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [phonePrefix, setPhonePrefix] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setEditUser(parsedUser);

      const userPhone = parsedUser.phone || "";
      const prefixMatch = countryCodes.find((c) => userPhone.startsWith(c.code));
      if (prefixMatch) {
        setPhonePrefix(prefixMatch.code);
        setPhoneNumber(userPhone.substring(prefixMatch.code.length));
      } else {
        setPhonePrefix("+91");
        setPhoneNumber(userPhone);
      }
      setPreviewImage(parsedUser.profileImage || null);
    }
  }, []);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-lg font-semibold">
          No user data found. Please log in.
        </p>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // 🔄 Function to handle the actual upload to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      throw new Error("Failed to upload image to Cloudinary.");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");
      if (!user._id) throw new Error("User ID is missing.");

      let imageUrl = editUser.profileImage;
      if (profileImage) {
        // 📤 If a new image is selected, upload it first
        imageUrl = await uploadToCloudinary(profileImage);
      }

      const payload = {
        ...editUser,
        phone: phonePrefix + phoneNumber,
        profileImage: imageUrl,
      };

      const response = await axios.put(
        `http://localhost:8000/users/update/${user._id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        const updatedUserData = { ...user, ...response.data.user };
        setUser(updatedUserData);
        localStorage.setItem("user", JSON.stringify(updatedUserData));
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile. " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    const userPhone = user.phone || "";
    const prefixMatch = countryCodes.find((c) => userPhone.startsWith(c.code));
    if (prefixMatch) {
      setPhonePrefix(prefixMatch.code);
      setPhoneNumber(userPhone.substring(prefixMatch.code.length));
    } else {
      setPhonePrefix("+91");
      setPhoneNumber(userPhone);
    }
    setEditUser(user);
    setProfileImage(null);
    setPreviewImage(user.profileImage);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Toaster position="top-center" reverseOrder={false} />
      <header className="relative w-full py-20 px-4 text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
        {/* Updated Profile Picture with Image Upload Button */}
        <div className="relative w-60 h-60 mx-auto mb-4 rounded-full border-4 border-white bg-blue-400 flex items-center justify-center text-5xl font-bold overflow-hidden group">
          {previewImage ? (
            <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User size={60} color="white" />
          )}
          {isEditing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-200 opacity-0 group-hover:opacity-100 rounded-full">
              <label
                htmlFor="profileImage"
                className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <ImageIcon size={20} />
                Change Image
              </label>
              <input
                type="file"
                id="profileImage"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          )}
        </div>
        <h1 className="text-4xl font-extrabold">{user.name}</h1>
        <p className="text-white/80 mt-1">{user.email}</p>
      </header>
      <main className="container mx-auto px-4 py-12">
        <section className="bg-white p-8 rounded-lg shadow-md mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <User size={24} className="text-indigo-500" />
              User Details
            </h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-md shadow hover:bg-indigo-600 transition-colors"
              >
                <Edit size={18} /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-md shadow hover:bg-gray-400 transition-colors"
                >
                  <X size={18} /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition-colors"
                >
                  <Save size={18} /> {loading ? "Saving..." : "Save"}
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editUser.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              ) : (
                <div className="bg-gray-100 p-3 rounded-md font-medium">
                  {user.name}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editUser.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              ) : (
                <div className="bg-gray-100 p-3 rounded-md font-medium">
                  {user.email}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">Phone Number</label>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <select
                    value={phonePrefix}
                    onChange={(e) => setPhonePrefix(e.target.value)}
                    className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none w-28"
                  >
                    {countryCodes.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} ({c.name})
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="e.g., 9876543210"
                  />
                </div>
              ) : (
                <div className="bg-gray-100 p-3 rounded-md font-medium">
                  {user.phone || "Not provided"}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">Location</label>
              {isEditing ? (
                <input
                  type="text"
                  name="location"
                  value={editUser.location || ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g., Chennai, India"
                />
              ) : (
                <div className="bg-gray-100 p-3 rounded-md font-medium">
                  {user.location || "Not provided"}
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Calendar size={24} className="text-green-500" />
            Your Booked Trips
          </h2>
          <div className="bg-gray-50 p-6 rounded-md border border-gray-200 text-center text-gray-500">
            <p className="mb-2">You haven't booked any trips yet.</p>
            <button
              onClick={() => navigate("/book-a-trip")}
              className="text-blue-600 hover:underline font-medium"
            >
              Explore vehicles to start your journey!
            </button>
          </div>
        </section>
        <div className="w-full mt-8 flex justify-center">
          <button
            onClick={handleLogout}
            className="w-full max-w-sm bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-md shadow-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;