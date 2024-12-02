"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const authController_1 = __importDefault(require("../controllers/authController"));
const router = express_1.default.Router();
// Get all users
router.get('/', userController_1.default.getAllUsers);
// Get user by ID
router.get('/:id', userController_1.default.getUserById);
// Update user by ID
router.put('/:id', userController_1.default.updateUser);
// Delete user by ID
router.delete('/:id', userController_1.default.deleteUser);
// Create a new user
router.post('/register', authController_1.default.registerUser);
exports.default = router;
