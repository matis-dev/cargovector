import * as admin from "firebase-admin";
import {Request, Response} from "firebase-functions/v1";

export const register = async (req: Request, res: Response) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const {email, password} = req.body;

  if (!email || !password) {
    res.status(400).json({error: "Email and password are required."});
    return;
  }

  try {
    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      emailVerified: false, // Start with email as unverified
    });

    // Create user profile in Firestore
    const userRef = admin.firestore().collection("users").doc(userRecord.uid);
    await userRef.set({
      email: userRecord.email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: "unconfirmed", // As per AC 2
      emailVerified: false,
    });

    // Send verification email
    const userEmail = userRecord.email;
    if (!userEmail) {
      // This case should ideally not happen if user creation was successful
      throw new Error("User email is not available.");
    }
    const link = await admin.auth().generateEmailVerificationLink(userEmail);

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("RESEND_API_KEY environment variable not set.");
      // Decide if you want to fail the registration or just log the error
      // For now, we'll proceed but log the error. The user won't get an email.
    } else {
      const {Resend} = await import("resend");
      const resend = new Resend(resendApiKey);

      const subject = "Verify your email for CargoVector";
      const htmlBody = `<h1>Welcome to CargoVector!</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${link}">Verify Email</a>`;

      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: userEmail,
        subject: subject,
        html: htmlBody,
      });
    }

    res.status(201).json({
      message: "User registered successfully. " +
        "Please check your email for verification.",
      uid: userRecord.uid,
      email: userRecord.email,
    });
  } catch (error: unknown) {
    console.error("Error creating user:", error);
    // Check if the error is a Firebase Auth error
    if (typeof error === "object" && error !== null && "code" in error) {
      const firebaseError = error as { code: string };
      if (firebaseError.code === "auth/email-already-exists") {
        res.status(409).json({error: "Email already in use."});
        return;
      }
    }
    res.status(500).json({error: "Internal Server Error"});
  }
};
