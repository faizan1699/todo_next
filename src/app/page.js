"use client";

import { useEffect, useState } from "react";
import CreateTodo from "./createtodo/page";
import Navbar from "./components/topbar/navbar";
import { useScroll } from "@react-three/drei";
export default function Home() {
  const [userLoad, setUserLoad] = useState(false);

  useEffect(() => {
    setUserLoad(true);
  }, [setUserLoad]);

  return (
    <>
      <Navbar refreshUser={userLoad} setNavDisplay="none" />
      <CreateTodo />
    </>
  );
}
