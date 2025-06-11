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
  res.cookie("username", username, {
    httpOnly: false, // client can read this cookie if needed
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
