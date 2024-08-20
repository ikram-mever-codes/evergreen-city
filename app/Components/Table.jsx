import React, { useEffect, useState } from "react";
import { updateTransaction, deleteTransaction } from "@/lib/api";
import { MdDelete, MdEdit, MdSave } from "react-icons/md";

const Table = ({ transactions, setTransactions }) => {
  const [editingRowId, setEditingRowId] = useState(null);
  const [searchInputs, setSearchInputs] = useState({
    startDate: "",
    type: "",
    fromTo: "",
    description: "",
    amount: "",
    updatedInBooks: "",
  });
  const [activeHeader, setActiveHeader] = useState(null);

  const handleHeaderClick = (field) => {
    setActiveHeader(field);
  };

  const handleSearchChange = (event, field) => {
    const value = event.target.value;

    if (field === "updatedInBooks") {
      const booleanValue = value === "Yes" ? true : value === "No" ? false : "";
      console.log(booleanValue);
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
      if (activeHeader && !event.target.closest("th")) {
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
    let month = date.getUTCMonth() + 1;
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
    const year = date.getUTCFullYear();
    return `${monthNames[month - 1]} ${day}, ${year}`;
  };

  const handleEdit = (id, field, value) => {
    const updatedTransactions = transactions.map((transaction) =>
      transaction._id === id ? { ...transaction, [field]: value } : transaction
    );

    setTransactions(updatedTransactions);
  };
  console.log(transactions);

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
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const renderCell = (transaction, field) => {
    const value = transaction[field];

    if (field === "createdAt") {
      return formatDate(value);
    } else if (field === "amount") {
      return (
        <input
          type="number"
          value={value || ""}
          onChange={(e) => handleEdit(transaction._id, field, e.target.value)}
          className="w-full border rounded-lg p-2"
          placeholder={`Enter ${field}`}
        />
      );
    } else if (field === "description") {
      return (
        <textarea
          value={value || ""}
          onChange={(e) => handleEdit(transaction._id, field, e.target.value)}
          autoFocus
          className="w-[15rem] border rounded-md text-left p-[10px]"
        />
      );
    } else if (field === "updatedInBooks") {
      return (
        <div className="w-full h-full flex justify-center items-center">
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) =>
              handleEdit(transaction._id, field, e.target.checked)
            }
            className="cursor-pointer"
          />
        </div>
      );
    } else {
      return (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => handleEdit(transaction._id, field, e.target.value)}
          className="w-full border rounded-lg p-2"
          placeholder={`Enter ${field}`}
        />
      );
    }
  };

  const renderRowCell = (transaction, field) => {
    if (field === "createdAt") {
      return (
        <div className="cursor-pointer min-w-[8rem] hover:bg-gray-200 p-1 text-center">
          {formatDate(transaction[field])}
        </div>
      );
    } else if (field === "amount") {
      return (
        <div className="cursor-pointer min-w-[8rem] hover:bg-gray-200 p-1 text-center">
          ₹{transaction[field]}
        </div>
      );
    } else if (field === "updatedInBooks") {
      return transaction[field] === true ? (
        <button
          className="w-full bg- text-center bg-green-600 text-white h-[2rem] rounded-full "
          onClick={async (e) => {
            handleEdit(transaction._id, field, false);
            await handleSaveRow(transaction._id);
          }}
        >
          Updated
        </button>
      ) : (
        <button
          onClick={async (e) => {
            handleEdit(transaction._id, field, true);
            await handleSaveRow(transaction._id);
          }}
          className="w-full bg- text-center bg-yellow-500 text-white h-[2rem] rounded-full "
        >
          Not Updated
        </button>
      );
    } else {
      return (
        <div className="cursor-pointer min-w-[8rem] hover:bg-gray-200 p-1 text-center">
          {transaction[field]}
        </div>
      );
    }
  };

  const renderRow = (transaction) => {
    return (
      <tr key={transaction._id}>
        {fields.map((field) =>
          field !== "actions" ? (
            <td key={field} className="py-2 px-4 border-b border-gray-300">
              {editingRowId === transaction._id
                ? renderCell(transaction, field)
                : renderRowCell(transaction, field)}
            </td>
          ) : null
        )}
        <td key={"actions"} className="py-2 px-4 border-b border-gray-300 ">
          <table>
            <tr>
              <td>
                {editingRowId === transaction._id ? (
                  <button
                    onClick={() => handleSaveRow(transaction._id)}
                    className="cursor-pointer text-white px-4 py-2 rounded-lg border-none outline-none bg-none` transition-colors"
                  >
                    <MdSave className="text-[25px] text-[#28BE96]" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditRow(transaction._id)}
                    className="cursor-pointer text-white px-4 py-2 rounded-lg border-none outline-none bg-none` transition-colors"
                  >
                    <MdEdit className="text-[25px] text-blue-600" />
                  </button>
                )}
              </td>
              <td>
                <button
                  onClick={() => handleDelete(transaction._id)}
                  className="cursor-pointer text-white px-1 py-4   rounded-lg border-none outline-none bg-none` transition-colors"
                >
                  <MdDelete className="text-[25px] text-red-600" />
                </button>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    );
  };

  return (
    <div className="p-4 md:p-8 w-full my-4 h-auto flex flex-col">
      <div className="overflow-x-auto w-full shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-[#28BE96] text-white font-semibold uppercase text-sm">
            <tr>
              {fields.map((field, index) => (
                <th
                  key={index}
                  className="py-4 px-4 border-b border-white cursor-pointer"
                  onClick={() => handleHeaderClick(field)}
                >
                  {activeHeader === field ? (
                    field === "updatedInBooks" ? (
                      <select
                        value={searchInputs[field]}
                        onChange={(e) => handleSearchChange(e, field)}
                        className="text-black p-2 border rounded-lg"
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    ) : field === "type" ? (
                      <select
                        value={searchInputs[field]}
                        onChange={(e) => handleSearchChange(e, field)}
                        className="text-black p-2 border rounded-lg"
                      >
                        <option value="">Select</option>
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={searchInputs[field]}
                        onChange={(e) => handleSearchChange(e, field)}
                        className="text-black p-2 border rounded-md w-full h-[2.5rem] text-[18px] font-[400] border-none outline-none"
                        placeholder={`Search By ${field}`}
                      />
                    )
                  ) : (
                    field
                  )}
                </th>
              ))}
              <th className="py-4 px-4 border-b border-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions
              .filter((transaction) => {
                return Object.keys(searchInputs).every((field) => {
                  const input = searchInputs[field];
                  if (input === "" || input === null) return true;
                  if (field === "updatedInBooks") {
                    return input === (transaction[field] ? "Yes" : "No");
                  }
                  return transaction[field]
                    ? transaction[field]
                        .toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    : false;
                });
              })
              .reverse()
              .map((transaction) => renderRow(transaction))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
