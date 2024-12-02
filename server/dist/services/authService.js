"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.registerUser = registerUser;
exports.loginUser = loginUser;
const prismaClient_1 = require("../models/prismaClient");
const validateUser_1 = require("../models/validateUser");
const bcrypt = __importStar(require("bcrypt"));
function registerUser(userData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Validate data
            (0, validateUser_1.validateUsers)(userData);
            const hashedPassword = yield bcrypt.hash(userData.password, 10);
            return yield prismaClient_1.prisma.users.create({
                data: Object.assign(Object.assign({}, userData), { password: hashedPassword })
            });
        }
        catch (error) {
            console.error('Failed to create user:', error, '\nPlease check the data and try again.');
            return;
        }
    });
}
function loginUser(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield prismaClient_1.prisma.users.findUnique({
                where: { username: username },
            });
            if (!user) {
                console.error('User not found.');
                return;
            }
            const passwordMatch = yield bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                console.error('Incorrect password.');
                return;
            }
            console.log(user.username, 'authentificated succesfully');
            return user;
        }
        catch (error) {
            console.error('Login failed. Please check your credentials.');
            return;
        }
    });
}
