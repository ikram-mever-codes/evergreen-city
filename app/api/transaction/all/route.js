import Transaction from "@/lib/transactionModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/lib/userModel";
const handler = async (req) => {
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

    let transactions = await Transaction.find({ userId: user._id });
    if (transactions.length === 0) {
      return NextResponse.json(
        { message: "No Transations Found!" },
        { status: 404 }
      );
    }

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export { handler as GET };
