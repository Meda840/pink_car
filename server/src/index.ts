import express from 'express';
import https from 'https';
import fs from 'fs';

import userRoute from './routes/userRoute';
import authRoute from './routes/authRoute';
import carRoute from './routes/carRoute';
import driverProfileRoute from './routes/driverProfileRoute';
import passengerProfileRoute from './routes/passengerProfileRoute';
import tripRoute from './routes/tripRoute';

const app = express();

app.use(express.json());

// Use the authentification API route
app.use('/authentificate', authRoute);

// Use the user API route
app.use('/user', userRoute);

// Use the car API route
app.use('/car', carRoute);

// Adding the driver profile API route
app.use('/driver', driverProfileRoute);

// Adding the passenger profile API route
app.use('/passenger', passengerProfileRoute);

// Adding the passenger profile API route
app.use('/trip', tripRoute);


// Set the HTTPS certificate and it's key
const options = {
  key: fs.readFileSync('./src/SSL/localhost.key'),
  cert: fs.readFileSync('./src/SSL/localhost.crt')
};

// Retreive the port
// const port = process.env.APP_PORT;

// Create the HTTPS server
https.createServer(options, app).listen(3000, () => {
  console.log(`Server running on port 3000`);
});