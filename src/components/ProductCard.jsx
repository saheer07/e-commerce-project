// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function ProductCard() {
//   const [wheels, setWheels] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:3001/wheels")
//       .then((res) => setWheels(res.data))
//       .catch((err) => console.log(err));
//   }, []);

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Available Wheels</h2>
//       {wheels.map((wheel) => (
//         <div key={wheel.id} className="border p-2 mb-2">
//           <p><strong>{wheel.name}</strong> - {wheel.size} - ₹{wheel.price}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default ProductCard;
