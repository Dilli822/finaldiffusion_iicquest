import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { Webhook } from "svix";
import User from "../models/user.model.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../nodemailer/emails.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// --------------------------------------------Register--------------------------------------------------

export const register = async (req, res) => {
  const { email, password, name, role, interests } = req.body;

  try {
    if (!email || !password || !name || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    // const verificationToken = crypto.randomBytes(4).toString("hex");

    const user = new User({
      email,
      password: hashedPassword,
      name,
      role,
      interests,
      // verificationToken,
      // verificationTokenExpiresAt: Date.now() + 3600000, // 1 hour
    });

    await user.save();

    // await sendVerificationEmail(user.email, verificationToken);

    const { password: pwd, ...rest } = user._doc;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: rest,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// --------------------------------------------Verify Email--------------------------------------------------

// export const verifyEmail = async (req, res) => {
//   const { code } = req.body;
//   try {
//     const user = await User.findOne({
//       verificationToken: code,
//       verificationTokenExpiresAt: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid or expired verification code",
//       });
//     }

//     user.isVerified = true;
//     user.verificationToken = undefined;
//     user.verificationTokenExpiresAt = undefined;
//     await user.save();

//     await sendWelcomeEmail(user.email, user.name);

//     const { password: pwd, ...rest } = user._doc;

//     res.status(200).json({
//       success: true,
//       message: "Email verified successfully",
//       user: rest,
//     });
//   } catch (error) {
//     console.log("error in verifyEmail ", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };
// --------------------------------------------Login--------------------------------------------------

export const login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // if (!user.isVerified) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Please verify your email before logging in",
    //   });
    // }

    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `You are not registered as a ${role}`,
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(res, user._id, user.name);

    await user.save();
    const { password: pwd, ...rest } = user._doc;
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: rest,
    });
  } catch (error) {
    console.log("Error in login ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// --------------------------------------------Logout--------------------------------------------------

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// --------------------------------------------Forget password--------------------------------------------------

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email address.",
    });
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // send email
    await sendPasswordResetEmail(
      user.email,
      `http://localhost:5173/auth/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// --------------------------------------------Reset password--------------------------------------------------

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // update password
    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// export const checkAuth = async (req, res) => {
//   try {
//     const user = await User.findById(req.userId).select("-password");
//     if (!user) {
//       return res
//         .status(400)
//         .json({ success: false, message: "User not found" });
//     }

//     res.status(200).json({ success: true, user });
//   } catch (error) {
//     console.log("Error in checkAuth ", error);
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// export const clerkWebhook = async (req, res) => {
//   const payload = req.body.toString();
//   const svixHeaders = req.headers;
//   const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY);

//   try {
//     const evt = wh.verify(payload, svixHeaders);
//     const { id, email_addresses, first_name, last_name } = evt.data;
//     const eventType = evt.type;

//     if (eventType === "user.created") {
//       const email = email_addresses[0].email_address;
//       const user = new User({
//         clerkUserId: id,
//         email,
//         firstName: first_name,
//         lastName: last_name,
//       });
//       await user.save();
//       console.log("User saved to database:", user);
//     }

//     res.status(200).json({ success: true, message: "Webhook received" });
//   } catch (err) {
//     console.error("Webhook verification failed:", err.message);
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// Fixed webhook handler

export const clerkWebhook = async (req, res) => {
  try {
    console.log("Headers:", req.headers);

    // Get raw body as string - req.body is already a Buffer from express.raw()
    const payload = req.body.toString();
    const headers = req.headers;

    console.log("Raw Body:", payload);
    console.log("Headers:", headers);

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY);
    let evt;

    try {
      // Use the raw string payload directly - don't stringify again
      evt = wh.verify(payload, {
        "svix-id": headers["svix-id"],
        "svix-timestamp": headers["svix-timestamp"],
        "svix-signature": headers["svix-signature"],
      });
      console.log("Webhook verified:", evt.type);
    } catch (err) {
      console.error("Verification error:", err);
      return res
        .status(400)
        .json({ success: false, message: "Webhook verification failed" });
    }

    const {
      id,
      email_addresses,
      first_name,
      last_name,
      image_url,
      phone_numbers,
    } = evt.data;

    console.log("Event data:", {
      id,
      email: email_addresses?.[0]?.email_address,
    });

    switch (evt.type) {
      case "user.created":
        const email = email_addresses[0]?.email_address;
        if (!email)
          return res
            .status(400)
            .json({ success: false, message: "No email provided" });

        const existingUser = await User.findOne({
          $or: [{ clerkUserId: id }, { email }],
        });

        if (!existingUser) {
          const newUser = new User({
            clerkUserId: id,
            email,
            firstName: first_name || "",
            lastName: last_name || "",
            name: `${first_name || ""} ${last_name || ""}`.trim(),
            profileImage: image_url || "",
            phoneNumber: phone_numbers?.[0]?.phone_number || "",
            isVerified: true,
          });
          await newUser.save();
          console.log("New user created:", newUser);
        }
        break;

      case "user.updated":
        // Handle user updates
        const updateEmail = email_addresses[0]?.email_address;
        if (updateEmail) {
          await User.findOneAndUpdate(
            { clerkUserId: id },
            {
              email: updateEmail,
              firstName: first_name || "",
              lastName: last_name || "",
              name: `${first_name || ""} ${last_name || ""}`.trim(),
              profileImage: image_url || "",
              phoneNumber: phone_numbers?.[0]?.phone_number || "",
            }
          );
          console.log("User updated:", id);
        }
        break;

      case "user.deleted":
        // Handle user deletion
        await User.findOneAndDelete({ clerkUserId: id });
        console.log("User deleted:", id);
        break;

      default:
        console.log("Unhandled event type:", evt.type);
    }

    res
      .status(200)
      .json({ success: true, message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
