import axios from "axios";
import { toast } from "react-hot-toast";

export const errorStyles = {};
export const successStyles = {};
export const loadingStyles = {};

const BASE_URL = "https://evergreen-city-pwa.vercel.app/api";

// Use Actions
export const login = async (email, password, router) => {
  try {
    let res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (res.status === 401 || 400 || 500 || 404) {
      router.push("/");
      return;
    }

    if (data.message === "Invalid Email!") {
      router.push("/");
      return;
    }
    if (data.message === "Incorrect Password!") {
      router.push("/");
      return;
    }
    if (!res.ok) {
      console.log(data);
      return;
    }
    toast.success(data.message);
    return data.user;
  } catch (error) {
    router.push("/");

    console.log(error);
    return;
  }
};

export const refresh = async () => {
  try {
    let res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();

    if (res.status === 401 || 400 || 500 || 404) {
      return;
    }
    if (!res.ok) {
      console.log(data.message);
      return;
    }
    return data.user;
  } catch (error) {
    console.log(error.message);
  }
};

export const logout = async (setUser, router) => {
  try {
    let res = await fetch(`${BASE_URL}/auth/logout`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (!res.ok) {
      router.push("/login");
      return;
    }

    toast.success(data.message, successStyles);
    setUser(null);
    router.push("/login");
  } catch (error) {
    console.log(error.message);
  }
};

// Transation Routes

export const getAllTransactions = async (setTransactions) => {
  try {
    let res = await fetch(`${BASE_URL}/transaction/all`, {
      method: "GET",
      cache: "no-store",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await res.json();

    if (!res.ok) {
      console.log(data.message);
      return;
    }

    setTransactions(data.transactions);
  } catch (error) {
    console.log(error.message);
  }
};

export const createTransaction = async (
  type,
  fromTo,
  description,
  amount,
  setTransactions,
  transactions,
  setShowPanel
) => {
  try {
    let res = await fetch(`${BASE_URL}/transaction/create`, {
      method: "POST",
      cache: "no-store",
      credentials: "include",
      body: JSON.stringify({ type, fromTo, description, amount }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await res.json();
    if (!res.ok) {
      return toast.error(data.message, errorStyles);
    }
    setTransactions([...transactions, data.transaction]);
    setShowPanel(false);
    return toast.success(data.message, successStyles);
  } catch (error) {
    return toast.error(error.message, errorStyles);
  }
};

export const updateTransaction = async (transactionId, body) => {
  try {
    toast.loading("Saving Transaction");
    let res = await fetch(`${BASE_URL}/transaction/${transactionId}`, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(body),
      cache: "no-store",
    });
    let data = await res.json();
    if (!res.ok) {
      toast.dismiss();
      return toast.error(data.message, errorStyles);
    }
    toast.dismiss();

    toast.success(data.message);
  } catch (error) {
    toast.dismiss();

    return toast.error(error.message);
  }
};

export const deleteTransaction = async (id) => {
  toast.loading("Deleting Transaction", loadingStyles);
  if (!id) {
    return toast.error("Id is Required!", errorStyles);
  }
  try {
    let res = await fetch(`${BASE_URL}/transaction/${id}`, {
      method: "DELETE",
      cache: "no-store",
      credentials: "include",

      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await res.json();
    if (!res.ok) {
      toast.dismiss();
      return toast.error(data.message, errorStyles);
    }
    toast.dismiss();
    toast.success(data.message);
  } catch (error) {
    toast.dismiss();
    return toast.error(error.message, errorStyles);
  }
};

/*
 */
