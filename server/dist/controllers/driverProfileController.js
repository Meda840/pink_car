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
const driverProfileService_1 = require("../services/driverProfileService");
class driverProfileController {
    createDriverProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newDriverProfile = yield (0, driverProfileService_1.createDriverProfile)(req.body);
                res.status(201).json(newDriverProfile);
            }
            catch (error) {
                res.status(500).json({ error: 'Error creating driver profile' });
            }
        });
    }
    getAllDriverProfiles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allDriverProfiles = yield (0, driverProfileService_1.getAllDriverProfiles)();
                res.status(200).json(allDriverProfiles);
            }
            catch (error) {
                res.status(500).json({ error: 'Error fetching all driver profiles' });
            }
        });
    }
    getDriverProfileById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = parseInt(req.params.id);
            try {
                const driverProfile = yield (0, driverProfileService_1.getDriverProfileById)(userId);
                if (!driverProfile) {
                    res.status(404).json({ error: 'Driver profile not found' });
                }
                else {
                    res.status(200).json(driverProfile);
                }
            }
            catch (error) {
                res.status(500).json({ error: 'Error fetching driver profile' });
            }
        });
    }
    updateDriverProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = parseInt(req.params.id);
            try {
                const updatedDriverProfile = yield (0, driverProfileService_1.updateDriverProfile)(userId, req.body);
                res.status(200).json(updatedDriverProfile);
            }
            catch (error) {
                res.status(500).json({ error: 'Error updating driver profile' });
            }
        });
    }
    deleteDriverProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = parseInt(req.params.id);
            try {
                yield (0, driverProfileService_1.deleteDriverProfile)(userId);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: 'Error deleting driver profile' });
            }
        });
    }
}
exports.default = new driverProfileController();
