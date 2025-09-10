import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const TravelContext = createContext();

const TravelContextProvider = (props) => {
  const currency = "$";
  const backendUrl = "http://localhost:8000";
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Fetch vehicles data from the new API
  const getCarsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/vehicles`);
      if (response.data) {
        const formattedCars = response.data.map((car) => ({
          id: car._id,
          name: `${car.brand} ${car.model}`,
          image: car.images && car.images.length > 0 ? car.images[0] : null,
          price: car.pricing.per_hour,
          comfort: car.type,
          seats: car.seating_capacity,
          features: car.amenities,
        }));
        setProducts(formattedCars);
      } else {
        console.error("Error: No data received from the API.");
      }
    } catch (error) {
      console.log("Error fetching cars:", error.message);
    }
  };

  // Function to handle logout
  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  // Load cars on mount
  useEffect(() => {
    getCarsData();
  }, []);

  const value = {
    currency,
    products,
    setProducts,
    token,
    setToken,
    backendUrl,
    logout,
  };

  return (
    <TravelContext.Provider value={value}>
      {props.children}
    </TravelContext.Provider>
  );
};

export default TravelContextProvider;