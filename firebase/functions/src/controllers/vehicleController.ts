import {Request, Response} from "express";
import {VehicleService} from "../services/vehicleService";
import {Vehicle} from "../models/vehicle";

let vehicleService: VehicleService;
const getVehicleService = () => {
  if (!vehicleService) {
    vehicleService = new VehicleService();
  }
  return vehicleService;
};

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const userId = req.uid; // Set by authMiddleware
    if (!userId) {
      return res.status(401).send({error: "Unauthorized: User ID not found."});
    }

    const vehicleData: Omit<Vehicle, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = req.body;

    // Basic validation
    if (!vehicleData.make || !vehicleData.model || !vehicleData.year || !vehicleData.licensePlate || !vehicleData.capacity || !vehicleData.unit) {
      return res.status(400).send({error: "Missing required vehicle fields."});
    }

    const newVehicle = await getVehicleService().createVehicle(userId, {
      ...vehicleData,
    });
    return res.status(201).send(newVehicle);
  } catch (error) {
    console.error("Error creating vehicle:", error);
    return res.status(500).send({error: "Internal Server Error"});
  }
};

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const userId = req.uid;
    if (!userId) {
      return res.status(401).send({error: "Unauthorized: User ID not found."});
    }

    const vehicles = await getVehicleService().getVehicles(userId);
    return res.status(200).send(vehicles);
  } catch (error) {
    console.error("Error getting vehicles:", error);
    return res.status(500).send({error: "Internal Server Error"});
  }
};

export const getVehicle = async (req: Request, res: Response) => {
  try {
    const userId = req.uid;
    if (!userId) {
      return res.status(401).send({error: "Unauthorized: User ID not found."});
    }

    const {vehicleId} = req.params;
    const vehicle = await getVehicleService().getVehicleById(userId, vehicleId);

    if (!vehicle) {
      return res.status(404).send({error: "Vehicle not found."});
    }

    return res.status(200).send(vehicle);
  } catch (error) {
    console.error("Error getting vehicle:", error);
    return res.status(500).send({error: "Internal Server Error"});
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const userId = req.uid;
    if (!userId) {
      return res.status(401).send({error: "Unauthorized: User ID not found."});
    }

    const {vehicleId} = req.params;
    const updates: Partial<Omit<Vehicle, 'id' | 'userId' | 'createdAt'>> = req.body;

    const existingVehicle = await getVehicleService().getVehicleById(userId, vehicleId);
    if (!existingVehicle) {
      return res.status(404).send({error: "Vehicle not found or not authorized."});
    }

    await getVehicleService().updateVehicle(userId, vehicleId, updates);
    return res.status(200).send({message: "Vehicle updated successfully."});
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return res.status(500).send({error: "Internal Server Error"});
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const userId = req.uid;
    if (!userId) {
      return res.status(401).send({error: "Unauthorized: User ID not found."});
    }

    const {vehicleId} = req.params;

    // Ensure vehicle exists and belongs to the user before deleting
    const existingVehicle = await getVehicleService().getVehicleById(userId, vehicleId);
    if (!existingVehicle) {
      return res.status(404).send({error: "Vehicle not found or not authorized."});
    }

    await getVehicleService().deleteVehicle(userId, vehicleId);
    return res.status(204).send(); // No content for successful deletion
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return res.status(500).send({error: "Internal Server Error"});
  }
};
