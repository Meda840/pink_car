"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const carRoute_1 = __importDefault(require("./routes/carRoute"));
const driverProfileRoute_1 = __importDefault(require("./routes/driverProfileRoute"));
const passengerProfileRoute_1 = __importDefault(require("./routes/passengerProfileRoute"));
const tripRoute_1 = __importDefault(require("./routes/tripRoute"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Use the authentification API route
app.use('/authentificate', authRoute_1.default);
// Use the user API route
app.use('/user', userRoute_1.default);
// Use the car API route
app.use('/car', carRoute_1.default);
// Adding the driver profile API route
app.use('/driver', driverProfileRoute_1.default);
// Adding the passenger profile API route
app.use('/passenger', passengerProfileRoute_1.default);
// Adding the passenger profile API route
app.use('/trip', tripRoute_1.default);
// Set the HTTPS certificate and it's key
const options = {
    key: fs_1.default.readFileSync('./src/SSL/localhost.key'),
    cert: fs_1.default.readFileSync('./src/SSL/localhost.crt')
};
// Retreive the port
// const port = process.env.APP_PORT;
// Create the HTTPS server
https_1.default.createServer(options, app).listen(3000, () => {
    console.log(`Server running on port 3000`);
});
