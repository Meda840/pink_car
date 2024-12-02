"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const carController_1 = __importDefault(require("../controllers/carController"));
const router = express_1.default.Router();
// Create a new user
router.post('/', carController_1.default.createCar);
// Get all users
router.get('/', carController_1.default.getAllCars);
// Get user by ID
router.get('/:id', carController_1.default.getCarById);
// Update user by ID
router.put('/:id', carController_1.default.updateCar);
// Delete user by ID
router.delete('/:id', carController_1.default.deleteCar);
exports.default = router;
