"use client";

import { createContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';
import dynamic from "next/dynamic";
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
export const EditTodoContext = createContext(null);

const RootComponent = ({ children }) => {

  const [func, setFunc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usertype, setUserType] = useState(null);
  const [editTodo, setEditTodo] = useState(true);

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


  useEffect(() => {
    const handleWarning = (event) => {
      if (event.message.includes('Extra attributes from the server: cz-shortcut-listen')) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener('warn', handleWarning);
    return () => {
      window.removeEventListener('warn', handleWarning);
    };
  }, []);


  return (

    <>
      <EditTodoContext.Provider value={{ editTodo, setEditTodo }}>
        <NavbarHitFunction.Provider value={setFunc}>
          <navfunc.Provider value={func}>
            <loadingpage.Provider value={loading}>
              <setLoadingPage.Provider value={setLoading}>
                <setUserTypeContext.Provider value={setUserType}>
                  <sendusertype.Provider value={usertype}>

                    <Navbar />
                    <LoadingPage />
                    <ToastContainer
                      position="bottom-left"
                      autoClose={2500}
                      closeOnClick
                    />
                    {children}

                  </sendusertype.Provider>
                </setUserTypeContext.Provider>
              </setLoadingPage.Provider>
            </loadingpage.Provider>
          </navfunc.Provider>
        </NavbarHitFunction.Provider>
      </EditTodoContext.Provider>
    </>

  )
}

export default RootComponent