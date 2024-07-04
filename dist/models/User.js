"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    studentCode: { type: String, required: true, unique: true },
    studentName: { type: String, required: true },
    studentClass: { type: String, required: true },
    studentPhone: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isOnline: { type: Boolean, default: false },
    status: { type: Number, default: 0 },
}, { collection: "users", timestamps: true });
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
