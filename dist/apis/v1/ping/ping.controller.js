"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PingController {
    static ping = (req, res, next) => {
        return res.status(200).json("pong");
    };
    static pingData = async (req, res, next) => {
        return res.status(200).json({
            body: req.body,
            auth: req.auth,
        });
    };
}
exports.default = PingController;
