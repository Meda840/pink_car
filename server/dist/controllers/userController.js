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
// import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from '../services/userService';
const userService_1 = require("../services/userService");
class userController {
    // async createUser(req: Request, res: Response) {
    //   try {
    //     const newUser = await createUser(req.body);
    //     res.status(201).json(newUser);
    //   } catch (error) {
    //     res.status(500).json({ error: 'Error creating user' });
    //   }
    // }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allUsers = yield (0, userService_1.getAllUsers)();
                res.status(200).json(allUsers);
            }
            catch (error) {
                res.status(500).json({ error: 'Error fetching all users' });
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = parseInt(req.params.id);
            try {
                const user = yield (0, userService_1.getUserById)(userId);
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                }
                else {
                    res.status(200).json(user);
                }
            }
            catch (error) {
                res.status(500).json({ error: 'Error fetching user' });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = parseInt(req.params.id);
            try {
                const updatedUser = yield (0, userService_1.updateUser)(userId, req.body);
                res.status(200).json(updatedUser);
            }
            catch (error) {
                res.status(500).json({ error: 'Error updating user' });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = parseInt(req.params.id);
            try {
                yield (0, userService_1.deleteUser)(userId);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: 'Error deleting user' });
            }
        });
    }
}
exports.default = new userController();
