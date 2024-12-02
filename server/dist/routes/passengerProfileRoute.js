"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passengerProfileController_1 = __importDefault(require("../controllers/passengerProfileController"));
const router = express_1.default.Router();
// Create a new passenger profile
router.post('/', passengerProfileController_1.default.createPassengerProfile);
// Retrieve all passenger profiles
router.get('/', passengerProfileController_1.default.getAllPassengerProfiles);
// Retrieve a passenger profile by ID
router.get('/:id', passengerProfileController_1.default.getPassengerProfileById);
// Update a passenger profile by ID
router.put('/:id', passengerProfileController_1.default.updatePassengerProfile);
// Delete a passenger profile by ID
router.delete('/:id', passengerProfileController_1.default.deletePassengerProfile);
exports.default = router;
