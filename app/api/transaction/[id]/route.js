import Transaction from "@/lib/transactionModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/lib/userModel";

const PUT = async (req, { params }) => {
  try {
    let token = req.cookies.get("token");

    if (!token || !token.value) {
      return NextResponse.json(
        { message: "Session Expired! Login Please." },
        { status: 401 }
      );
    }
    let decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    if (!decoded.id) {
      return NextResponse.json(
        { message: "Session Expired! Login Please." },
        { status: 401 }
      );
    }
    let user = await User.findById(decoded.id);

    let body = await req.json();
    let type = body.type;
    let fromTo = body.fromTo;
    let description = body.description;
    let amount = body.amount;
    let updatedInBooks = body.updatedInBooks;

    let transaction = await Transaction.findById(params.id);

    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction not Found!" },
        { status: 404 }
      );
    }
    if (transaction.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        {
          message: "Unauthorized to Edit this transaction",
        },
        {
          status: 401,
        }
      );
    }
    transaction.type = type || transaction.type;
    transaction.fromTo = fromTo || transaction.fromTo;
    transaction.description = description || transaction.description;
    transaction.amount = amount || transaction.amount;
    transaction.updatedInBooks = updatedInBooks || transaction.updatedInBooks;

    await transaction.save();
    return NextResponse.json(
      { transaction, message: "Transaction Saved!" },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

const DELETE = async (req, { params }) => {
  try {
    let token = req.cookies.get("token");

    if (!token || !token.value) {
      return NextResponse.json(
        { message: "Session Expired! Login Please." },
        { status: 401 }
      );
    }
    let decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    if (!decoded.id) {
      return NextResponse.json(
        { message: "Session Expired! Login Please." },
        { status: 401 }
      );
    }
    let user = await User.findById(decoded.id);

    let transaction = await Transaction.findById(params.id);

    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction not Found!" },
        { status: 404 }
      );
    }
    if (transaction.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        {
          message: "Unauthorized to Edit this transaction",
        },
        {
          status: 401,
        }
      );
    }
    await Transaction.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: "Transaction Deleted!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export { PUT, DELETE };
