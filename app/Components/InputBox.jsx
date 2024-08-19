"use client";
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { useGlobalContext } from "../ContextProvider";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";
import { createTransaction } from "@/lib/api";

const InputBox = () => {
  const { setShowPanel, transactions, setTransactions } = useGlobalContext();
  const [type, setType] = useState("Expense");
  const [errorMessage, setErrorMessage] = useState("");
  const [fromTo, setFromTo] = useState("");
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!type || !fromTo || !amount) {
      setErrorMessage("Incomplete Fields!");
      return;
    }
    setLoading(true);
    await createTransaction(
      type,
      fromTo,
      comment,
      amount,
      setTransactions,
      transactions,
      setShowPanel
    );
    setLoading(false);
  };

  document.addEventListener("keydown", () => {
    setErrorMessage("");
  });
  return (
    <div className="w-full h-full absolute overflow-hidden top-0 left-0 bg-[#6e6f70] bg-opacity-80 z-[100000] flex justify-center items-center">
      <div className="w-[90%] max-w-lg bg-white h-[90vh] rounded-2xl shadow-lg p-[10px] px-[20px] relative">
        <button
          className="absolute top-2 right-2 text-red-500"
          onClick={() => setShowPanel(false)}
        >
          <MdClose className="text-3xl" />
        </button>
        <h2 className="text-2xl font-semibold mb-[10px]">
          Add/Update Transaction
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-[15px]">
            <div>
              <label className="block text-gray-700">Type:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border rounded-lg p-2"
              >
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700">From/To:</label>
              <input
                type="text"
                value={fromTo}
                onChange={(e) => setFromTo(e.target.value)}
                placeholder="Party"
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-gray-700">Amount:</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-gray-700">Comment:</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Additional notes"
                className="w-full border rounded-lg p-2 h-20 resize-none"
              />
            </div>
            {errorMessage !== "" && (
              <div className="w-full text-center  font-[400] text-red-600">
                {errorMessage}
              </div>
            )}
            <div className="flex justify-center">
              <button
                disabled={loading}
                type="submit"
                className="disabled:cursor-not-allowed text-black text-[20px] font-semibold px-4 py-2 w-full rounded-lg  bg-gradient-to-r from-yellow-300 via-lime-400 to-teal-500 hover:from-yellow-400 hover:via-lime-500 hover:to-teal-600"
              >
                Add
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputBox;
