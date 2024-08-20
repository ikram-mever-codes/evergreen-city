"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { toast } from "react-hot-toast";
import { errorStyles, getAllTransactions, login } from "@/lib/api";
import { useGlobalContext } from "../ContextProvider";
import { useRouter } from "next/navigation";

const Page = () => {
  const { user, setUser, setTransactions } = useGlobalContext();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Incomplete Credentials!", errorStyles);
      return;
    }

    setLoading(true);
    try {
      const loggedInUser = await login(email, password, router);
      if (loggedInUser) {
        setUser(loggedInUser);
        await getAllTransactions(setTransactions);
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Login failed!", errorStyles);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user !== null) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="w-[100vw] h-max min-h-[100vh] flex justify-center items-center">
      <div className="w-[90%] h-[75vh] bg-white simple-shadow flex sm:w-[50%]  lg:w-[40%] justify-between items-center flex-col p-[20px]">
        <div className="w-full h-max flex justify-start items-center flex-col gap-[10px]">
          <Image
            src="/icon.png"
            alt="Alt Logo"
            width={80}
            height={80}
            className="object-cover object-center"
          />
          <h1 className="text-[20px] font-[700]">EVERGREEN CITY</h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full h-full flex justify-between items-center  flex-col"
        >
          <div className="flex justify-center h-full items-center flex-col gap-[30px]">
            <div className="w-full h-[3.5rem] bg-[#e8e5e5] rounded-full flex gap-[5px] justify-start items-center p-[5px] px-[10px]">
              <MdEmail className="text-[25px] mx-[5px]" />
              <input
                type="email"
                placeholder="Email"
                className="bg-transparent text-[18px] border-none outline-none h-full w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="w-full h-[3.5rem] bg-[#e8e5e5] rounded-full flex gap-[5px] justify-start items-center p-[5px] px-[10px]">
              <MdLock className="text-[25px] mx-[5px]" />
              <input
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                className="bg-transparent text-[18px] border-none outline-none h-full w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {showPassword ? (
                <MdVisibilityOff
                  onClick={() => setShowPassword(false)}
                  className="text-[25px] mx-[5px] cursor-pointer"
                />
              ) : (
                <MdVisibility
                  onClick={() => setShowPassword(true)}
                  className="text-[25px] mx-[5px] cursor-pointer"
                />
              )}
            </div>
            <button
              disabled={loading}
              type="submit"
              className="disabled:cursor-not-allowed text-black text-[20px] font-semibold px-4 py-2 w-full rounded-lg  bg-gradient-to-r from-yellow-300 via-lime-400 to-teal-500 hover:from-yellow-400 hover:via-lime-500 hover:to-teal-600"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
