"use client";
import { getAllTransactions } from "@/lib/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import InputBox from "../Components/InputBox";
import MobTable from "../Components/MobTable";
import Table from "../Components/Table";
import { useGlobalContext } from "../ContextProvider";

const Page = () => {
  const { user } = useGlobalContext();
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      if (!user) {
        return router.push("/");
      } else {
        getAllTransactions(setTransactions);
      }
    };
    fetch();
  }, [user]);
  const { showPanel } = useGlobalContext();
  return (
    <div className="w-full h-max p">
      {showPanel && (
        <InputBox
          transactions={transactions}
          setTransactions={setTransactions}
        />
      )}

      <div className="w-full h-max  hidden lg:block">
        <Table transactions={transactions} setTransactions={setTransactions} />
      </div>
      <div className="w-full h-max lg:hidden mb-[100px]">
        <MobTable
          transactions={transactions}
          setTransactions={setTransactions}
        />
      </div>
    </div>
  );
};

export default Page;
