import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {register} from "./auth/register";
import {verifyEmail} from "./auth/verifyEmail";

admin.initializeApp();

export const registerUser = functions.https.onRequest(async (req, res) => {
  await register(req, res);
});

export const verifyEmailHandler = functions.https.onRequest(
    async (req, res) => {
      await verifyEmail(req, res);
    });

// Conditionally export test utilities only in emulator mode
if (process.env.FUNCTIONS_EMULATOR === 'true') {
  const testUtils = require('./test-utils');
  exports.deleteTestUser = testUtils.deleteTestUser;
}
