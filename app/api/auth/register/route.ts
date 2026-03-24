
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { User } from "@/models/User";
import { Wallet } from "@/models/Wallet";
import connectToDB from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { name, email, phone, password, age, gender, adminCode } = await req.json();

    if (!name || !email || !phone || !password || !age || !gender) {
      return NextResponse.json(
        { message: "Name, email, phone, password, age, and gender are required" },
        { status: 400 }
      );
    }

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const existingUserByPhone = await User.findOne({ phone });
    if (existingUserByPhone) {
      return NextResponse.json(
        { message: "User with this phone already exists" },
        { status: 409 }
      );
    }

    const roles: Array<'passenger' | 'admin'> = ['passenger'];

    if (adminCode) {
      const ADMIN_SIGNUP_CODE = process.env.ADMIN_SIGNUP_CODE;
      if (!ADMIN_SIGNUP_CODE) {
        return NextResponse.json(
          { message: "Admin signup is not configured" },
          { status: 500 }
        );
      }

      if (adminCode !== ADMIN_SIGNUP_CODE) {
        return NextResponse.json(
          { message: "Invalid admin signup code" },
          { status: 403 }
        );
      }

      roles.push('admin');
    }

    const user = new User({
      name,
      email,
      phone,
      password,
      age,
      gender,
      roles,
    });
    const savedUser = await user.save();

    const wallet = new Wallet({
      user: savedUser._id,
    });
    await wallet.save();

    savedUser.wallet = wallet._id;
    await savedUser.save();

    const tokenPayload = {
      id: savedUser._id,
      roles: savedUser.roles,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: "7d",
    });

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json(
      {
        success: true,
        token: token,
        user: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
          roles: savedUser.roles,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup Error:", error);
    if (error instanceof Error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}
