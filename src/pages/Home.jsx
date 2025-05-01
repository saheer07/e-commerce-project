import React from 'react';
import homeImage from '../assets/images/Home.jpeg'; 
import Products from  './Products'

function Home() {
  return (
    <div className="w-full flex justify-center items-center ">
      <img 
        src={homeImage} 
        alt="Home Logo" 
        className="w-full  h-auto object-contain"
      />
       <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-700 text-white py-2 px-6 rounded-md">
        Show Now
      </button>
      <section className="p-4">
        <Products />
      </section>
    </div>
  );
}

export default Home;
