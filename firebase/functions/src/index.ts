import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";

import {register} from "./auth/register";
import {verifyEmail} from "./auth/verifyEmail";
import {authMiddleware} from "./auth/authMiddleware";
import {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
} from "./controllers/vehicleController";

admin.initializeApp();

const app = express();
app.use(cors({origin: true}));
app.use(express.json());
app.use(authMiddleware);

// Auth routes (public, handled before authMiddleware in specific functions)
export const registerUser = functions.https.onRequest(async (req, res) => {
  await register(req, res);
});

export const verifyEmailHandler = functions.https.onRequest(
    async (req, res) => {
      await verifyEmail(req, res);
    });

// Vehicle routes (protected)
app.post("/vehicles", createVehicle);
app.get("/vehicles", getVehicles);
app.get("/vehicles/:vehicleId", getVehicle);
app.put("/vehicles/:vehicleId", updateVehicle);
app.delete("/vehicles/:vehicleId", deleteVehicle);

export const api = functions.https.onRequest(app);

// Conditionally export test utilities only in emulator mode
if (process.env.FUNCTIONS_EMULATOR === 'true') {
  const testUtils = require('./test-utils');
  exports.deleteTestUser = testUtils.deleteTestUser;
}
