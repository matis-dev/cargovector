
import { vi, beforeEach, describe, it, expect } from "vitest";
import { VehicleService } from "../vehicleService";
import { Vehicle } from "../../models/vehicle";
import * as admin from "firebase-admin";

// Create mocks for the Firestore functions
const mockSet = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockGet = vi.fn();
const mockDoc = vi.fn(() => ({
  id: "mock-doc-id",
  set: mockSet,
  get: mockGet,
  update: mockUpdate,
  delete: mockDelete,
}));
const mockCollection = vi.fn(() => ({
  doc: mockDoc,
  get: mockGet,
}));

vi.mock("firebase-admin", () => ({
  initializeApp: vi.fn(),
  firestore: vi.fn(() => ({
    collection: mockCollection,
  })),
}));

// Separately mock the FieldValue since it's a static property
Object.defineProperty(admin.firestore, 'FieldValue', {
  value: {
    serverTimestamp: vi.fn(() => 'MOCKED_TIMESTAMP'),
  },
});

describe("VehicleService", () => {
  let service: VehicleService;
  const userId = "testUserId";

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Re-initialize the service to ensure it gets the fresh mocks
    service = new VehicleService();
  });

  describe("createVehicle", () => {
    it("should create a new vehicle", async () => {
      const vehicleData: Omit<Vehicle, "id" | "userId" | "createdAt" | "updatedAt"> = {
        make: "Toyota",
        model: "Camry",
        year: 2020,
        licensePlate: "TEST123",
        capacity: 500,
        unit: "kg",
      };

      // The mockDoc function is called without arguments by the service, so we need to configure its return value
      mockDoc.mockReturnValue({
        set: mockSet,
        id: "newVehicleId", // Provide a mock ID for the new document
        get: mockGet,
        update: mockUpdate,
        delete: mockDelete,
      });

      const result = await service.createVehicle(userId, vehicleData);

      expect(mockCollection).toHaveBeenCalledWith(`users/${userId}/vehicles`);
      expect(mockDoc).toHaveBeenCalled(); // It's called with no arguments
      expect(mockSet).toHaveBeenCalledWith({
        ...vehicleData,
        userId,
        createdAt: "MOCKED_TIMESTAMP",
        updatedAt: "MOCKED_TIMESTAMP",
      });
      // Check the returned object
      expect(result).toEqual({
        id: "newVehicleId",
        ...vehicleData,
        userId,
        createdAt: "MOCKED_TIMESTAMP",
        updatedAt: "MOCKED_TIMESTAMP",
      });
    });
  });

  describe("getVehicles", () => {
    it("should return all vehicles for a user", async () => {
        const vehicle1: Omit<Vehicle, 'id'> = {
            userId,
            make: "Toyota", model: "Camry", year: 2020, licensePlate: "TEST123",
            capacity: 500, unit: "kg", createdAt: "MOCKED_TIMESTAMP" as any, updatedAt: "MOCKED_TIMESTAMP" as any,
        };
        const vehicle2: Omit<Vehicle, 'id'> = {
            userId,
            make: "Honda", model: "Civic", year: 2018, licensePlate: "TEST456",
            capacity: 400, unit: "kg", createdAt: "MOCKED_TIMESTAMP" as any, updatedAt: "MOCKED_TIMESTAMP" as any,
        };

      mockGet.mockResolvedValue({
        docs: [
          { id: "v1", data: () => vehicle1 },
          { id: "v2", data: () => vehicle2 },
        ],
      });

      const result = await service.getVehicles(userId);

      expect(mockCollection).toHaveBeenCalledWith(`users/${userId}/vehicles`);
      expect(mockGet).toHaveBeenCalled();
      expect(result).toEqual([
        { id: "v1", ...vehicle1 },
        { id: "v2", ...vehicle2 },
      ]);
    });
  });

  describe("getVehicleById", () => {
    it("should return a vehicle by ID", async () => {
        const vehicle: Omit<Vehicle, 'id'> = {
            userId,
            make: "Toyota", model: "Camry", year: 2020, licensePlate: "TEST123",
            capacity: 500, unit: "kg", createdAt: "MOCKED_TIMESTAMP" as any, updatedAt: "MOCKED_TIMESTAMP" as any,
        };
      mockGet.mockResolvedValue({
        exists: true,
        data: () => vehicle,
        id: "v1",
      });

      const result = await service.getVehicleById(userId, "v1");

      expect(mockCollection).toHaveBeenCalledWith(`users/${userId}/vehicles`);
      expect(mockDoc).toHaveBeenCalledWith("v1");
      expect(mockGet).toHaveBeenCalled();
      expect(result).toEqual({ id: "v1", ...vehicle });
    });

    it("should return null if vehicle not found", async () => {
      mockGet.mockResolvedValue({
        exists: false,
      });

      const result = await service.getVehicleById(userId, "nonExistentId");

      expect(mockCollection).toHaveBeenCalledWith(`users/${userId}/vehicles`);
      expect(mockDoc).toHaveBeenCalledWith("nonExistentId");
      expect(mockGet).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe("updateVehicle", () => {
    it("should update an existing vehicle", async () => {
      const updates = { model: "Corolla", capacity: 600 };

      await service.updateVehicle(userId, "v1", updates);

      expect(mockCollection).toHaveBeenCalledWith(`users/${userId}/vehicles`);
      expect(mockDoc).toHaveBeenCalledWith("v1");
      expect(mockUpdate).toHaveBeenCalledWith({
        ...updates,
        updatedAt: "MOCKED_TIMESTAMP",
      });
    });
  });

  describe("deleteVehicle", () => {
    it("should delete a vehicle", async () => {
      await service.deleteVehicle(userId, "v1");

      expect(mockCollection).toHaveBeenCalledWith(`users/${userId}/vehicles`);
      expect(mockDoc).toHaveBeenCalledWith("v1");
      expect(mockDelete).toHaveBeenCalled();
    });
  });
});