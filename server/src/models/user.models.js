
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    collegeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 64,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    department: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    year: {
      type: Number,
      min: 1,
      max: 6,
    },

    section: {
      type: String,
      trim: true,
      maxlength: 20,
    },
    avatar: {
      type: String,
      default: null,
    },

    bio: {
      type: String,
      maxlength: 250,
      trim: true,
      default: "",
    },

    role: {
      type: String,
      enum: [
        "student",
        "faculty",
        "publisher",
        "moderator",
        "admin",
      ],
      default: "student",
      index: true,
    },

    status: {
      type: String,
      enum: [
        "active",
        "inactive",
        "suspended",
        "banned",
      ],
      default: "active",
      index: true,
    },
    verified: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },

    passwordChangedAt: {
      type: Date,
      select: false,
      default: null,
    },
    reputation: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastActiveAt: {
      type: Date,
      default: null,
    },

  },
  {
    timestamps: true,
  }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);