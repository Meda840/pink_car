"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tripController_1 = __importDefault(require("../controllers/tripController"));
const router = express_1.default.Router();
// Create a new passenger profile
router.post('/', tripController_1.default.createTrip);
// Retrieve all passenger profiles
router.get('/', tripController_1.default.getAllTrips);
// Retrieve a passenger profile by ID
router.get('/:id', tripController_1.default.getTripById);
// Update a passenger profile by ID
router.put('/:id', tripController_1.default.updateTrip);
// Delete a passenger profile by ID
router.delete('/:id', tripController_1.default.deleteTrip);
exports.default = router;
