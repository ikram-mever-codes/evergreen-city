const { NextResponse } = require("next/server");
import database from "@/lib/database";
import User from "@/lib/userModel";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  try {
    const body = await req.json();
    const email = body.email;
    const password = body.password;
    if (!email || !password) {
      return NextResponse.json(
        { message: "All the Fields Are Required!" },
        { status: 400 }
      );
    }
    await database();
    let user = await User.findOne({ email });
    if (!user) {
      // let password = "Khanistan_7";
      // let hashPassword = await bcryptjs.hash(password, 10);
      // console.log(hashPassword);
      // let user = new User({
      //   email: "ikram.codes@gmail.com",
      //   password: hashPassword,
      //   name: "IKRAM KHAN",
      // });
      // await user.save();

      return NextResponse.json({ message: "Invalid Email!" }, { status: 401 });
    }

    let comparePassword = await bcryptjs.compare(password, user.password);

    if (!comparePassword) {
      return NextResponse.json(
        { message: "Incorrect Password!" },
        { status: 401 }
      );
    }

    let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    let response = NextResponse.json(
      { message: `Welcome Back ${user.name}!`, user },
      { status: 200 }
    );

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

export { handler as POST };
