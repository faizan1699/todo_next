"use client";

import axios from "axios";
import { useEffect } from "react";

const Profile = () => {

    const fetchUser = async () => {

        try {
            const response = await axios.post("api/profile");
            console.log(response);
            // const userobject = response.data.userData;
            // const data = JSON.stringify(userobject)
            // console.log(data)
            // localStorage.setItem("userToken", data);
        }
        catch (error) {
            console.log(error)
        }
    }


    return (
        <div>

   
            <p>-----------------------------------------</p>

            <button style={{ border: "1px solid black", background: "yellow", padding: "10px 20px" }} onClick={fetchUser}>get profile data</button>

        </div>
    )
}

export default Profile