import * as admin from "firebase-admin";
import {Vehicle} from "../models/vehicle";

export class VehicleService {
  private db: admin.firestore.Firestore;

  constructor() {
    console.log("admin:", admin);
    console.log("admin.firestore:", admin.firestore);
    this.db = admin.firestore();
    console.log("this.db:", this.db);
  }

  /**
   * Creates a new vehicle for a given user.
   * @param userId The ID of the user.
   * @param vehicleData The data for the new vehicle.
   * @returns The created vehicle with its ID.
   */
  async createVehicle(userId: string, vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<Vehicle> {
    const vehicleRef = this.db.collection(`users/${userId}/vehicles`).doc();
    const newVehicle: Vehicle = {
      ...vehicleData,
      userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await vehicleRef.set(newVehicle);
    return {id: vehicleRef.id, ...newVehicle};
  }

  /**
   * Retrieves all vehicles for a given user.
   * @param userId The ID of the user.
   * @returns An array of vehicles.
   */
  async getVehicles(userId: string): Promise<Vehicle[]> {
    const snapshot = await this.db.collection(`users/${userId}/vehicles`).get();
    return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()} as Vehicle));
  }

  /**
   * Retrieves a single vehicle by its ID for a given user.
   * @param userId The ID of the user.
   * @param vehicleId The ID of the vehicle.
   * @returns The vehicle, or null if not found.
   */
  async getVehicleById(userId: string, vehicleId: string): Promise<Vehicle | null> {
    const doc = await this.db.collection(`users/${userId}/vehicles`).doc(vehicleId).get();
    if (!doc.exists) {
      return null;
    }
    return {id: doc.id, ...doc.data()} as Vehicle;
  }

  /**
   * Updates an existing vehicle for a given user.
   * @param userId The ID of the user.
   * @param vehicleId The ID of the vehicle to update.
   * @param updates The fields to update.
   */
  async updateVehicle(
    userId: string,
    vehicleId: string,
    updates: Partial<Omit<Vehicle, 'id' | 'userId' | 'createdAt'>>
  ): Promise<void> {
    await this.db.collection(`users/${userId}/vehicles`).doc(vehicleId).update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  /**
   * Deletes a vehicle for a given user.
   * @param userId The ID of the user.
   * @param vehicleId The ID of the vehicle to delete.
   */
  async deleteVehicle(userId: string, vehicleId: string): Promise<void> {
    await this.db.collection(`users/${userId}/vehicles`).doc(vehicleId).delete();
  }
}
