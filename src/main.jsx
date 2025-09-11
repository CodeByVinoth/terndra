import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // or your main CSS file
import TravelContextProvider from './pages/vehicle/TravelContext.jsx'; // Correct path to your context file
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="194534240510-tlrjupa806fqou88p4aaae4u6g8eovq7.apps.googleusercontent.com">

  <React.StrictMode>
    <TravelContextProvider>
      <App />
    </TravelContextProvider>
  </React.StrictMode>
  </GoogleOAuthProvider>

);