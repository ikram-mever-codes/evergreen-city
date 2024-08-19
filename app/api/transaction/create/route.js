import Transaction from "@/lib/transactionModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/lib/userModel";
const handler = async (req) => {
  try {
    console.log("fdf");
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

    if (!type || !fromTo || !amount) {
      return NextResponse.json({ message: "Missing Fields!" }, { status: 400 });
    }

    let transaction = new Transaction({
      userId: user._id,
      type,
      fromTo,
      description,
      amount,
    });
    await transaction.save();
    return NextResponse.json(
      { message: "Transaction added Successfully!", transaction },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
export { handler as POST };
