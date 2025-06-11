import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkUserId: {
      type: String,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
    },
    bio: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: ["creator", "recruiter"],
    },
    interests: {
      type: [String],
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      type: String,
    },
    isTermsAndServicesAccepted: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    communities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }],
    friendList: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
