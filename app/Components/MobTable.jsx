import React, { useEffect, useState } from "react";
import { updateTransaction, deleteTransaction } from "@/lib/api";
import { MdClose, MdDelete, MdEdit, MdSave, MdSearch } from "react-icons/md";
import { toast } from "react-hot-toast";

const MobTable = ({ transactions, setTransactions }) => {
  const [editingRowId, setEditingRowId] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchInputs, setSearchInputs] = useState({
    startDate: "",
    type: "",
    fromTo: "",
    description: "",
    amount: "",
    updatedInBooks: "",
  });
  const [activeHeader, setActiveHeader] = useState(null);

  const handleSearchChange = (event, field) => {
    const value = event.target.value;

    if (field === "updatedInBooks") {
      const booleanValue = value === "Yes" ? true : value === "No" ? false : "";
      setSearchInputs((prev) => ({
        ...prev,
        [field]: booleanValue,
      }));
    } else {
      setSearchInputs((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeHeader && !event.target.closest(".header")) {
        setActiveHeader(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeHeader]);

  const fields = [
    "createdAt",
    "type",
    "fromTo",
    "description",
    "amount",
    "updatedInBooks",
  ];

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getUTCDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    return `${monthNames[month - 1]} ${day}, ${year}`;
  };

  const handleEdit = (id, field, value) => {
    const updatedTransactions = transactions.map((transaction) =>
      transaction._id === id ? { ...transaction, [field]: value } : transaction
    );

    setTransactions(updatedTransactions);
  };

  const handleEditRow = (id) => {
    setEditingRowId(id);
  };

  const handleSaveRow = async (id) => {
    try {
      const transaction = transactions.find((t) => t._id === id);
      await updateTransaction(id, transaction);
      setEditingRowId(null);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      let pmt = confirm("Do You want to delete this Transaction");

      if (!pmt) {
        return;
      }
      await deleteTransaction(id);
      setTransactions(
        transactions.filter((transaction) => transaction._id !== id)
      );
      toast.success("Transaction deleted successfully!");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction.");
    }
  };

  const renderField = (transaction, field) => {
    const value = transaction[field];

    if (field === "createdAt") {
      return formatDate(value);
    } else if (field === "amount") {
      return (
        <input
          type="number"
          value={value || ""}
          onChange={(e) => handleEdit(transaction._id, field, e.target.value)}
          className="w-full border border-gray-300 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={`Enter ${field}`}
        />
      );
    } else if (field === "description") {
      return (
        <textarea
          value={value || ""}
          onChange={(e) => handleEdit(transaction._id, field, e.target.value)}
          autoFocus
          className="w-full border border-gray-300 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={`Enter ${field}`}
        />
      );
    } else if (field === "updatedInBooks") {
      return (
        <input
          type="checkbox"
          checked={value || false}
          onChange={(e) => handleEdit(transaction._id, field, e.target.checked)}
          className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      );
    } else {
      return (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => handleEdit(transaction._id, field, e.target.value)}
          className="w-full border border-gray-300 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={`Enter ${field}`}
        />
      );
    }
  };

  const renderTransaction = (transaction) => (
    <div
      key={transaction._id}
      className="p-3 mb-3 border border-gray-300 rounded-lg bg-white shadow-lg transition-transform transform hover:scale-105 hover:shadow-lg"
    >
      {fields.map((field) => (
        <div key={field} className="mb-3">
          <label className="block text-gray-700 font-semibold mb-1 capitalize">
            {field.replace(/([A-Z])/g, " $1")}
          </label>
          {editingRowId === transaction._id ? (
            renderField(transaction, field)
          ) : field === "createdAt" || field === "amount" ? (
            field === "amount" ? (
              `₹${transaction[field]}`
            ) : (
              formatDate(transaction[field])
            )
          ) : field === "updatedInBooks" ? (
            transaction[field] ? (
              <button
                className="w-full text-center bg-green-500 text-white py-1.5 rounded-full hover:bg-green-600 transition"
                onClick={async () => {
                  handleEdit(transaction._id, field, false);
                  await handleSaveRow(transaction._id);
                }}
              >
                Updated
              </button>
            ) : (
              <button
                onClick={async () => {
                  handleEdit(transaction._id, field, true);
                  await handleSaveRow(transaction._id);
                }}
                className="w-full text-center bg-yellow-500 text-white py-1.5 rounded-full hover:bg-yellow-600 transition"
              >
                Not Updated
              </button>
            )
          ) : (
            transaction[field]
          )}
        </div>
      ))}
      <div className="flex justify-end space-x-3">
        {editingRowId === transaction._id ? (
          <button
            onClick={() => handleSaveRow(transaction._id)}
            className="flex items-center space-x-2 bg-green-500 text-white px-3 py-1.5 rounded-md hover:bg-green-600 transition"
          >
            <MdSave />
            <span>Save</span>
          </button>
        ) : (
          <button
            onClick={() => handleEditRow(transaction._id)}
            className="flex items-center space-x-2 bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition"
          >
            <MdEdit />
            <span>Edit</span>
          </button>
        )}
        <button
          onClick={() => handleDelete(transaction._id)}
          className="flex items-center space-x-2 bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition"
        >
          <MdDelete />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 w-full my-4 h-auto flex flex-col space-y-5 rounded-lg shadow-xl">
      {showSearch ? (
        <div className="p-4 bg-white shadow-xl border relative  border-gray-300 rounded-md">
          <button
            onClick={() => {
              setShowSearch(false);
            }}
            className="m-[10px] absolute right-0 top-0"
          >
            <MdClose className="text-[30px]  text-red-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Search Transactions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fields.map((field) => (
              <div key={field} className="flex flex-col">
                <label className="text-gray-600 mb-2">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type={field === "updatedInBooks" ? "checkbox" : "text"}
                  value={
                    field === "updatedInBooks" ? "" : searchInputs[field] || ""
                  }
                  checked={
                    field === "updatedInBooks" ? searchInputs[field] : undefined
                  }
                  onChange={(e) => handleSearchChange(e, field)}
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Search by ${field}`}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <button
          className="text-[25px]"
          onClick={() => {
            setShowSearch(!showSearch);
          }}
        >
          <MdSearch />
        </button>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {transactions
          .filter((transaction) =>
            Object.keys(searchInputs).every((field) =>
              searchInputs[field]
                ? transaction[field]
                    ?.toString()
                    .toLowerCase()
                    .includes(searchInputs[field].toString().toLowerCase())
                : true
            )
          )
          .reverse()
          .map(renderTransaction)}
      </div>
    </div>
  );
};

export default MobTable;
