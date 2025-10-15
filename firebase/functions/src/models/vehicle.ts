import * as admin from "firebase-admin";

export interface Vehicle {
  id?: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  capacity: number; // e.g., in tons or cubic meters
  unit: string; // e.g., 'tons', 'cubic_meters'
  createdAt: admin.firestore.FieldValue;
  updatedAt: admin.firestore.FieldValue;
}
