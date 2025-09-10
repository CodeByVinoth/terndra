import { createContext } from "react";
import { Travels } from "../../assets/assets";

export const TravelContext = createContext();

const TravelContextProvider = (props) => {
  const currency = '$';


  const value = {
    currency,
    Travels,
  };

  return (
    <TravelContext.Provider value={value}>
      {props.children}
    </TravelContext.Provider>
  );
};

export default TravelContextProvider;
