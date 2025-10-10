
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import cors from "cors";

const corsHandler = cors({ origin: true });

export const deleteTestUser = functions.https.onRequest((req, res) => {
  // Use CORS middleware
  corsHandler(req, res, async () => {
    // Ensure this function only runs in a non-production environment
    if (process.env.FUNCTIONS_EMULATOR !== "true") {
      functions.logger.error("Attempted to run test utility in production.");
      res.status(403).send("Forbidden");
      return;
    }

    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const { email } = req.body;

    if (!email) {
      res.status(400).send("Bad Request: Missing email in request body.");
      return;
    }

    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      await admin.auth().deleteUser(userRecord.uid);
      functions.logger.log(`Successfully deleted test user: ${email}`);
      res.status(200).send({ success: true, message: `User ${email} deleted.` });
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        functions.logger.log(`Test user not found, nothing to delete: ${email}`);
        res.status(200).send({ success: true, message: "User not found, no action needed." });
      } else {
        functions.logger.error(`Error deleting test user ${email}:`, error);
        res.status(500).send({ success: false, error: error.message });
      }
    }
  });
});
