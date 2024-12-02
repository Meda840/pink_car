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
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const prismaClient_1 = require("../models/prismaClient");
const validateUser_1 = require("../models/validateUser");
const bcrypt = __importStar(require("bcrypt"));
// async function createUser(userData: any) {
//   try {
//     // Validate data
//     validateUsers(userData);
//     // Create new user
//     return await prisma.users.create({
//         data: userData,
//     });
//   } catch (error) {
//     console.error('Error creating user:', error, '\nPlease check the data and try again.');
//     return;
//   }
// }
function getAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield prismaClient_1.prisma.users.findMany();
        }
        catch (error) {
            console.error('Error fetching all user');
            return;
        }
    });
}
function getUserById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield prismaClient_1.prisma.users.findUnique({
                where: { id: userId },
            });
        }
        catch (error) {
            console.error('Error fetching user');
            return;
        }
    });
}
function updateUser(userId, updatedData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Validate data
            (0, validateUser_1.validateUsersUpdate)(updatedData);
            // Hash the password if it is being updated
            if (updatedData.password) {
                updatedData.password = yield bcrypt.hash(updatedData.password, 10);
            }
            else if (updatedData.password == '') {
                updatedData.password = null;
            }
            // update the user by ID
            return yield prismaClient_1.prisma.users.update({
                where: { id: userId },
                data: updatedData,
            });
        }
        catch (error) {
            console.error('Error updating user');
            return;
        }
    });
}
function deleteUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Delete related Passenger_Profile if it exists
            yield prismaClient_1.prisma.passenger_Profile.deleteMany({
                where: { userId: userId },
            });
            // Delete related Driver_Profile if it exists
            yield prismaClient_1.prisma.driver_Profile.deleteMany({
                where: { userId: userId },
            });
            // Finally, delete the user
            yield prismaClient_1.prisma.users.delete({
                where: { id: userId },
            });
            console.log(`User with ID ${userId} and related profiles have been deleted.`);
        }
        catch (error) {
            console.error('Error deleting user');
            return;
        }
    });
}
