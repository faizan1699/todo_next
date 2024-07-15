"use client";

import dynamic from "next/dynamic";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const Navbar = dynamic(() => import("@/app/components/topbar/navbar"), {
    ssr: false
});

const page = ({ children }) => {

    return (
        <>
            <Navbar />
            <ToastContainer
                position="top-center"
                autoClose={3000}
                closeOnClick
            />
            {children}
        </>
    )
}

export default page