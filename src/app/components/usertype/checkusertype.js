// import axios from "axios";
// import { useEffect, useState } from "react";

// const CheckUsertype = () => {

//   const userdata = localStorage.getItem("userToken");
//   const data = JSON.parse(userdata);
//   const [isuseradmin, setIsAdmin] = useState(null); // Initialize with null for loading state

//   useEffect(() => {
//     const fetchUsertype = async () => {
//       try {
//         const response = await axios.post("/api/profile/usertype", {
//           email: data.email,
//         });
//         console.log(response.data); // Log the response to verify structure
//         setIsAdmin(response.data.isadmin);
//       } catch (error) {
//         console.log("Error fetching user type:", error.message);
//         setIsAdmin(false); // Handle error by setting isAdmin to false or other appropriate handling
//       }
//     };

//     if (data && data.email) {
//       fetchUsertype();
//     }
//   }, [data]); // Ensure useEffect runs when data.email changes

//   return { isuseradmin };
// };

// export default CheckUsertype;
