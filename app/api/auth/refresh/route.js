import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/lib/userModel";
import database from "@/lib/database";
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

    await database();

    let user = await User.findById(decoded.id);

    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    let response = NextResponse.json({ user }, { status: 200 });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 3600 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export { handler as GET };
