
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET!;

export const getTokenFromCookies = (req: NextRequest) => {
  return req.cookies.get("token")?.value;
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; roles: string[] };
  } catch (error) {
    return null;
  }
};

export const getUserFromToken = async (token: string) => {
  const decoded = verifyToken(token);

  if (!decoded) {
    return null;
  }

  const user = await User.findById(decoded.id).select("-password");
  return user;
};
