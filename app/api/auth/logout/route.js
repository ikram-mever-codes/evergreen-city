import { NextResponse } from "next/server";

const handler = async (req) => {
  try {
    const cookies = req.cookies;
    const token = cookies.get("token");

    if (!token || !token.value) {
      return NextResponse.json(
        { message: "Session Expired! Login Please." },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      { message: "User Logged Out!" },
      { status: 200 }
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export { handler as GET };
