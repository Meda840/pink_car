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
const passengerProfileService_1 = require("../services/passengerProfileService");
class PassengerProfileController {
    createPassengerProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newPassengerProfile = yield (0, passengerProfileService_1.createPassengerProfile)(req.body);
                res.status(201).json(newPassengerProfile);
            }
            catch (error) {
                res.status(500).json({ error: 'Error creating passenger profile' });
            }
        });
    }
    getAllPassengerProfiles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allPassengerProfiles = yield (0, passengerProfileService_1.getAllPassengerProfiles)();
                res.status(200).json(allPassengerProfiles);
            }
            catch (error) {
                res.status(500).json({ error: 'Error fetching all passenger profiles' });
            }
        });
    }
    getPassengerProfileById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = parseInt(req.params.id);
            try {
                const passengerProfile = yield (0, passengerProfileService_1.getPassengerProfileById)(userId);
                if (!passengerProfile) {
                    res.status(404).json({ error: 'Passenger profile not found' });
                }
                else {
                    res.status(200).json(passengerProfile);
                }
            }
            catch (error) {
                res.status(500).json({ error: 'Error fetching passenger profile' });
            }
        });
    }
    updatePassengerProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = parseInt(req.params.id);
            try {
                const updatedPassengerProfile = yield (0, passengerProfileService_1.updatePassengerProfile)(userId, req.body);
                res.status(200).json(updatedPassengerProfile);
            }
            catch (error) {
                res.status(500).json({ error: 'Error updating passenger profile' });
            }
        });
    }
    deletePassengerProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = parseInt(req.params.id);
            try {
                yield (0, passengerProfileService_1.deletePassengerProfile)(userId);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: 'Error deleting passenger profile' });
            }
        });
    }
}
exports.default = new PassengerProfileController();
