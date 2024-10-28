import { model, Schema } from "mongoose";
import { roles, status } from "../../src/utils/constant/enum.js";

// Schema
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    recoveryEmail: {
        type: String,
        trim: true
    },
    DOB: {
        type: Date,
        default: Date.now,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    role: {
        type: String,
        enum: Object.values(roles),
        default: roles.USER
    },
    status: {
        type: String,
        enum: Object.values(status),
        default: status.OFFLINE
    },
    verified: {
        type: Boolean,
        default: false
    },
    otp: String,
    otpExpires: Date,
}, { timestamps: true });

// Model
export const User = model('User', userSchema);
