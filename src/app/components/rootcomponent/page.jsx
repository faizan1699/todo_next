"use client";

import { createContext, useEffect, useState } from "react";
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
export const setUserTypeContext = createContext(null);
export const sendusertype = createContext(null);

const page = ({ children }) => {

  const [func, setFunc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usertype, setUserType] = useState(null);

  if (func === true) {
    setTimeout(() => {
      setFunc(null);
    }, 1500);
  }

  useEffect(() => {
    const numberInput = document.getElementById('numberInput');

    if (numberInput) {
      const handleKeyDown = (event) => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
          event.preventDefault();
        }
      };

      const handleWheel = (event) => {
        event.preventDefault();
      };

      numberInput.addEventListener('keydown', handleKeyDown);
      numberInput.addEventListener('wheel', handleWheel);

      return () => {
        numberInput.removeEventListener('keydown', handleKeyDown);
        numberInput.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);

  return (
    <NavbarHitFunction.Provider value={setFunc}>
      <navfunc.Provider value={func}>
        <loadingpage.Provider value={loading}>
          <setLoadingPage.Provider value={setLoading}>
            <setUserTypeContext.Provider value={setUserType}>
              <sendusertype.Provider value={usertype}>
             
                <Navbar />
                <LoadingPage />
                <ToastContainer
                  position="top-center"
                  autoClose={3000}
                  closeOnClick
                />
                {children}

              </sendusertype.Provider>
            </setUserTypeContext.Provider>
          </setLoadingPage.Provider>
        </loadingpage.Provider>
      </navfunc.Provider>
    </NavbarHitFunction.Provider>
  )
}

export default page