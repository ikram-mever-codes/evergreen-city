"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import InputBox from "../Components/InputBox";
import MobTable from "../Components/MobTable";
import Table from "../Components/Table";
import { useGlobalContext } from "../ContextProvider";

const Page = () => {
  const { user } = useGlobalContext();
  const router = useRouter();
  useEffect(() => {
    if (!user) router.push("/");
  }, [user]);
  const { showPanel } = useGlobalContext();
  return (
    <div className="w-full h-max p">
      {showPanel && <InputBox />}

      <div className="w-full h-max  hidden lg:block">
        <Table />
      </div>
      <div className="w-full h-max lg:hidden mb-[100px]">
        <MobTable />
      </div>
    </div>
  );
};

export default Page;
