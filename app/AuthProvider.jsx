"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "./ContextProvider";

const AuthProvider = ({ children }) => {
  const { user } = useGlobalContext();
  const router = useRouter();

  if (user === null) {
    router.push("/login");
    return;
  } else {
    return children;
  }
};

export default AuthProvider;
