"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareFunction = exports.hashFunction = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_ROUNDS = 10;
const hashFunction = async (plaintext) => {
    return bcrypt_1.default.hashSync(plaintext, SALT_ROUNDS);
};
exports.hashFunction = hashFunction;
const compareFunction = async (plaintext, hashedString) => {
    return bcrypt_1.default.compareSync(plaintext, hashedString);
};
exports.compareFunction = compareFunction;
