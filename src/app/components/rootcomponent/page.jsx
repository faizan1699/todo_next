"use client";

import { createContext, useState } from "react";
import { ToastContainer } from "react-toastify";

import dynamic from "next/dynamic";
import 'react-toastify/dist/ReactToastify.css';
import LoadingPage from "../loadingpage/loadingpage";

const Navbar = dynamic(() => import("@/app/components/topbar/navbar"), {
    ssr: false
});

export const NavbarHitFunction = createContext(null)
export const navfunc = createContext(null);
export const loadingpage = createContext(null);
export const setLoadingPage = createContext(null);

const page = ({ children }) => {

    const [func, setFunc] = useState(null);
    const [loading, setLoading] = useState(false);

    if (func === true) {
        setTimeout(() => {
            setFunc(null);
        }, 1500);
    }

    return (
        <NavbarHitFunction.Provider value={setFunc}>
            <navfunc.Provider value={func}>
                <loadingpage.Provider value={loading}>
                    <setLoadingPage.Provider value={setLoading}>
                        <Navbar />
                        <LoadingPage />
                        <ToastContainer
                            position="top-center"
                            autoClose={3000}
                            closeOnClick
                        />
                        {children}
                    </setLoadingPage.Provider>
                </loadingpage.Provider>
            </navfunc.Provider>
        </NavbarHitFunction.Provider>
    )
}

export default page