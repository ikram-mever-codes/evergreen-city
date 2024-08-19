"use client";
import Link from "next/link";
import React from "react";
import { MdAdd, MdLogout } from "react-icons/md";
import { useGlobalContext } from "../ContextProvider";
import { logout } from "@/lib/api";
import { useRouter } from "next/navigation";

const Menu = () => {
  const { showInput, setShowPanel } = useGlobalContext();
  const { setUser } = useGlobalContext();
  const router = useRouter();

  const handlerLogout = async () => {
    await logout(setUser, router);
  };

  return (
    <div className="w-full h-[5rem] lg:h-[6rem] shdow bg-white  fixed bottom-0 z-50">
      <ul className="flex justify-center items-center gap-[10px] w-full h-full">
        <li>
          <button
            onClick={() => setShowPanel(true)}
            className="flex items-center justify-center w-[4rem] h-[4rem] lg:w-[5rem] lg:h-[5rem] bg-gradient-to-r from-yellow-300 via-lime-400 to-teal-500 rounded-full"
          >
            <MdAdd className="text-black text-4xl lg:text-5xl" />
          </button>
        </li>
        <li>
          <button
            onClick={handlerLogout}
            className="flex items-center justify-center w-[3rem] h-[3rem] lg:w-[3.5rem] lg:h-[3.5rem] border-none outline-none rounded-full bg-white"
          >
            <MdLogout className="text-black text-3xl" />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
