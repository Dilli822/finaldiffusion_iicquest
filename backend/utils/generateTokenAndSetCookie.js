import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId, username) => {
  const token = jwt.sign({ userId, username }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
