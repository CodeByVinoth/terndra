import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // or your main CSS file
import TravelContextProvider from './pages/vehicle/TravelContext.jsx'; // Correct path to your context file

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TravelContextProvider>
      <App />
    </TravelContextProvider>
  </React.StrictMode>
);