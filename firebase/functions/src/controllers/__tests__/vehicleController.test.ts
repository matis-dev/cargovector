import {Request, Response} from "express";
import {vi, beforeEach, describe, it, expect} from "vitest";

import {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
} from "../vehicleController";
import {Vehicle} from "../../models/vehicle";

const mockCreateVehicle = vi.fn();
const mockGetVehicles = vi.fn();
const mockGetVehicleById = vi.fn();
const mockUpdateVehicle = vi.fn();
const mockDeleteVehicle = vi.fn();

vi.mock("../../services/vehicleService", () => ({
  VehicleService: vi.fn(() => ({
    createVehicle: mockCreateVehicle,
    getVehicles: mockGetVehicles,
    getVehicleById: mockGetVehicleById,
    updateVehicle: mockUpdateVehicle,
    deleteVehicle: mockDeleteVehicle,
  })),
}));

describe("VehicleController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  const userId = "testUserId";

  beforeEach(() => {
    mockRequest = {
      uid: userId,
      body: {},
      params: {},
    };
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };
    vi.clearAllMocks();
  });

  describe("createVehicle", () => {
    it("should create a vehicle and return 201", async () => {
      const vehicleData: Omit<Vehicle, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
        make: "Toyota",
        model: "Camry",
        year: 2020,
        licensePlate: "TEST123",
        capacity: 500,
        unit: "kg",
      };
      const newVehicle: Vehicle = {
        id: "newVehicleId",
        userId,
        createdAt: "MOCKED_TIMESTAMP" as any,
        updatedAt: "MOCKED_TIMESTAMP" as any,
        ...vehicleData,
      };

      mockRequest.body = vehicleData;
      mockCreateVehicle.mockResolvedValue(newVehicle);

      await createVehicle(mockRequest as Request, mockResponse as Response);

      expect(mockCreateVehicle).toHaveBeenCalledWith(userId, { ...vehicleData });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalledWith(newVehicle);
    });

    it("should return 400 if required fields are missing", async () => {
      mockRequest.body = {make: "Toyota"}; // Missing other fields

      await createVehicle(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith({error: "Missing required vehicle fields."});
    });

    it("should return 401 if userId is not present", async () => {
      mockRequest.uid = undefined;
      mockRequest.body = {
        make: "Toyota",
        model: "Camry",
        year: 2020,
        licensePlate: "TEST123",
        capacity: 500,
        unit: "kg",
      };

      await createVehicle(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith({error: "Unauthorized: User ID not found."});
    });
  });

  describe("getVehicles", () => {
    it("should return all vehicles for a user", async () => {
      const vehicles: Vehicle[] = [
        {
          id: "v1",
          userId,
          make: "Toyota",
          model: "Camry",
          year: 2020,
          licensePlate: "TEST123",
          capacity: 500,
          unit: "kg",
          createdAt: "MOCKED_TIMESTAMP" as any,
          updatedAt: "MOCKED_TIMESTAMP" as any,
        },
      ];
      mockGetVehicles.mockResolvedValue(vehicles);

      await getVehicles(mockRequest as Request, mockResponse as Response);

      expect(mockGetVehicles).toHaveBeenCalledWith(userId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(vehicles);
    });

    it("should return 401 if userId is not present", async () => {
      mockRequest.uid = undefined;

      await getVehicles(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith({error: "Unauthorized: User ID not found."});
    });
  });

  describe("getVehicle", () => {
    it("should return a vehicle by ID", async () => {
      const vehicle: Vehicle = {
        id: "v1",
        userId,
        make: "Toyota",
        model: "Camry",
        year: 2020,
        licensePlate: "TEST123",
        capacity: 500,
        unit: "kg",
        createdAt: "MOCKED_TIMESTAMP" as any,
        updatedAt: "MOCKED_TIMESTAMP" as any,
      };
      mockRequest.params = {vehicleId: "v1"};
      mockGetVehicleById.mockResolvedValue(vehicle);

      await getVehicle(mockRequest as Request, mockResponse as Response);

      expect(mockGetVehicleById).toHaveBeenCalledWith(userId, "v1");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(vehicle);
    });

    it("should return 404 if vehicle not found", async () => {
      mockRequest.params = {vehicleId: "nonExistentId"};
      mockGetVehicleById.mockResolvedValue(null);

      await getVehicle(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith({error: "Vehicle not found."});
    });

    it("should return 401 if userId is not present", async () => {
      mockRequest.uid = undefined;
      mockRequest.params = {vehicleId: "v1"};

      await getVehicle(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith({error: "Unauthorized: User ID not found."});
    });
  });

  describe("updateVehicle", () => {
    it("should update a vehicle and return 200", async () => {
      const updates = {model: "Corolla", capacity: 600};
      const existingVehicle: Vehicle = {
        id: "v1",
        userId,
        make: "Toyota",
        model: "Camry",
        year: 2020,
        licensePlate: "TEST123",
        capacity: 500,
        unit: "kg",
        createdAt: "MOCKED_TIMESTAMP" as any,
        updatedAt: "MOCKED_TIMESTAMP" as any,
      };

      mockRequest.params = {vehicleId: "v1"};
      mockRequest.body = updates;
      mockGetVehicleById.mockResolvedValue(existingVehicle);
      mockUpdateVehicle.mockResolvedValue(undefined);

      await updateVehicle(mockRequest as Request, mockResponse as Response);

      expect(mockGetVehicleById).toHaveBeenCalledWith(userId, "v1");
      expect(mockUpdateVehicle).toHaveBeenCalledWith(userId, "v1", updates);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith({message: "Vehicle updated successfully."});
    });

    it("should return 404 if vehicle not found", async () => {
      mockRequest.params = {vehicleId: "nonExistentId"};
      mockRequest.body = {model: "Corolla"};
      mockGetVehicleById.mockResolvedValue(null);

      await updateVehicle(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith({error: "Vehicle not found or not authorized."});
    });

    it("should return 401 if userId is not present", async () => {
      mockRequest.uid = undefined;
      mockRequest.params = {vehicleId: "v1"};
      mockRequest.body = {model: "Corolla"};

      await updateVehicle(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith({error: "Unauthorized: User ID not found."});
    });
  });

  describe("deleteVehicle", () => {
    it("should delete a vehicle and return 204", async () => {
      const existingVehicle: Vehicle = {
        id: "v1",
        userId,
        make: "Toyota",
        model: "Camry",
        year: 2020,
        licensePlate: "TEST123",
        capacity: 500,
        unit: "kg",
        createdAt: "MOCKED_TIMESTAMP" as any,
        updatedAt: "MOCKED_TIMESTAMP" as any,
      };

      mockRequest.params = {vehicleId: "v1"};
      mockGetVehicleById.mockResolvedValue(existingVehicle);
      mockDeleteVehicle.mockResolvedValue(undefined);

      await deleteVehicle(mockRequest as Request, mockResponse as Response);

      expect(mockGetVehicleById).toHaveBeenCalledWith(userId, "v1");
      expect(mockDeleteVehicle).toHaveBeenCalledWith(userId, "v1");
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it("should return 404 if vehicle not found", async () => {
      mockRequest.params = {vehicleId: "nonExistentId"};
      mockGetVehicleById.mockResolvedValue(null);

      await deleteVehicle(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith({error: "Vehicle not found or not authorized."});
    });

    it("should return 401 if userId is not present", async () => {
      mockRequest.uid = undefined;
      mockRequest.params = {vehicleId: "v1"};

      await deleteVehicle(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith({error: "Unauthorized: User ID not found."});
    });
  });
});
