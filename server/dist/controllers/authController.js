"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const authService_1 = require("../services/authService");
class AuthController {
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield (0, authService_1.registerUser)(req.body);
                res.status(201).json(newUser);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to create user. Please check the data and try again.' });
            }
        });
    }
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield (0, authService_1.loginUser)(req.body.username, req.body.password);
                res.status(200).json(newUser);
            }
            catch (error) {
                res.status(401).json({ error: 'Login failed. Please check your credentials.' });
            }
        });
    }
}
exports.default = new AuthController();
