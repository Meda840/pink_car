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
const tripService_1 = require("../services/tripService");
class TripController {
    createTrip(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newTrip = yield (0, tripService_1.createTrip)(req.body);
                res.status(201).json(newTrip);
            }
            catch (error) {
                res.status(500).json({ error: 'Error creating trip' });
            }
        });
    }
    getAllTrips(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allTrips = yield (0, tripService_1.getAllTrips)();
                res.status(200).json(allTrips);
            }
            catch (error) {
                res.status(500).json({ error: 'Error fetching all trips' });
            }
        });
    }
    getTripById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripId = parseInt(req.params.id);
            try {
                const trip = yield (0, tripService_1.getTripById)(tripId);
                if (!trip) {
                    res.status(404).json({ error: 'Trip not found' });
                }
                else {
                    res.status(200).json(trip);
                }
            }
            catch (error) {
                res.status(500).json({ error: 'Error fetching trip' });
            }
        });
    }
    updateTrip(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripId = parseInt(req.params.id);
            try {
                const updatedTrip = yield (0, tripService_1.updateTrip)(tripId, req.body);
                res.status(200).json(updatedTrip);
            }
            catch (error) {
                res.status(500).json({ error: 'Error updating trip' });
            }
        });
    }
    deleteTrip(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripId = parseInt(req.params.id);
            try {
                yield (0, tripService_1.deleteTrip)(tripId);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: 'Error deleting trip' });
            }
        });
    }
}
exports.default = new TripController();
