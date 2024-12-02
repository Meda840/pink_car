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
const carService_1 = require("../services/carService");
class carController {
    createCar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newCar = yield (0, carService_1.createCar)(req.body);
                res.status(201).json(newCar);
            }
            catch (error) {
                res.status(500).json({ error: 'Error creating car' });
            }
        });
    }
    getAllCars(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allCars = yield (0, carService_1.getAllCars)();
                res.status(200).json(allCars);
            }
            catch (error) {
                res.status(500).json({ error: 'Error fetching all cars' });
            }
        });
    }
    getCarById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const carId = parseInt(req.params.id);
            try {
                const car = yield (0, carService_1.getCarById)(carId);
                if (!car) {
                    res.status(404).json({ error: 'car not found' });
                }
                else {
                    res.status(200).json(car);
                }
            }
            catch (error) {
                res.status(500).json({ error: 'Error fetching car' });
            }
        });
    }
    updateCar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const carId = parseInt(req.params.id);
            try {
                const updatedCar = yield (0, carService_1.updateCar)(carId, req.body);
                res.status(200).json(updatedCar);
            }
            catch (error) {
                res.status(500).json({ error: 'Error updating car' });
            }
        });
    }
    deleteCar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const carId = parseInt(req.params.id);
            try {
                yield (0, carService_1.deleteCar)(carId);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: 'Error deleting car' });
            }
        });
    }
}
exports.default = new carController();
