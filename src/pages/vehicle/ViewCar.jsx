import React from 'react';
import Filter from './Filter';
import Destination from './Destination';

export const ViewCar = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <Destination />
        <Filter />
      </div>
    </div>
  );
};

export default ViewCar;