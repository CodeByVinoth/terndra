import React, { useState } from 'react';
import Filter from './Filter';
import Destination from './Destination';
import VehicleDetails from './VehicleDetails';

export const ViewCar = () => {
  // State to hold the ID of the currently selected vehicle
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  // Function to be passed down to the child components
  const handleVehicleSelect = (id) => {
    setSelectedVehicleId(id);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <Destination />
        
        {/* Conditional Rendering: Show VehicleDetails if an ID is selected, otherwise show Filter */}
        {selectedVehicleId ? (
          <VehicleDetails vehicleId={selectedVehicleId} onBack={() => setSelectedVehicleId(null)} />
        ) : (
          <Filter onVehicleSelect={handleVehicleSelect} />
        )}
      </div>
    </div>
  );
};

export default ViewCar;