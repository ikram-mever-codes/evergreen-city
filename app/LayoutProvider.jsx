"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Menu from "./Components/Menu";
import AuthProvider from "./AuthProvider";
import { useGlobalContext } from "./ContextProvider";
import Loading from "./loading";

const LayoutProvider = ({ children }) => {
  const { loading } = useGlobalContext();
  let path = usePathname();
  let excludeMenu = path === "/login" || path === "/";

  return loading ? (
    <Loading />
  ) : excludeMenu ? (
    <main className="w-full h-max">{children}</main>
  ) : (
    <AuthProvider>
      <main className="w-full min-h-[100vh] relative pb-[5rem] lg:pb-[6rem]">
        {children}
        <Menu />
      </main>
    </AuthProvider>
  );
};

export default LayoutProvider;
