import React from 'react';
import homeImage from '../assets/images/Home.jpeg'; 

function Home() {
  return (
    <div className="w-full flex justify-center items-center ">
      <img 
        src={homeImage} 
        alt="Home Logo" 
        className="w-full  h-auto object-contain"
      />
    </div>
  );
}

export default Home;
