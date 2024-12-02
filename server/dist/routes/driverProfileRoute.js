"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const driverProfileController_1 = __importDefault(require("../controllers/driverProfileController"));
const router = express_1.default.Router();
// Create a new driver profile
router.post('/', driverProfileController_1.default.createDriverProfile);
// Retrieve all driver profiles
router.get('/', driverProfileController_1.default.getAllDriverProfiles);
// Retrieve a driver profile by ID
router.get('/:id', driverProfileController_1.default.getDriverProfileById);
// Update a driver profile by ID
router.put('/:id', driverProfileController_1.default.updateDriverProfile);
// Delete a driver profile by ID
router.delete('/:id', driverProfileController_1.default.deleteDriverProfile);
exports.default = router;
