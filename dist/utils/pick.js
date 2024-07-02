"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickData = void 0;
const lodash_1 = __importDefault(require("lodash"));
const pickData = ({ fields = [], object = {} }) => {
    if (fields.length === 0)
        return object;
    return lodash_1.default.pick(object, fields);
};
exports.pickData = pickData;
