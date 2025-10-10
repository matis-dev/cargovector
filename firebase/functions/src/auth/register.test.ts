import {describe, it, expect, vi, beforeEach} from "vitest";
import {register} from "./register";
import {Request, Response} from "firebase-functions/v1";

const mockCreateUser = vi.fn();
const mockSet = vi.fn();
const mockGenerateLink = vi.fn();

vi.mock("firebase-admin", () => ({
  initializeApp: vi.fn(),
  auth: () => ({
    createUser: mockCreateUser,
    generateEmailVerificationLink: mockGenerateLink,
  }),
  firestore: Object.assign(vi.fn(() => ({
    collection: () => ({
      doc: () => ({
        set: mockSet,
      }),
    }),
  })), {
    FieldValue: {
      serverTimestamp: vi.fn(() => "MOCK_TIMESTAMP"),
    },
  }),
}));

describe("register function", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: Record<string, unknown>;
  let responseStatus: number;

  beforeEach(() => {
    vi.clearAllMocks();
    responseJson = {};
    responseStatus = 0;

    mockResponse = {
      status: vi.fn(function(this: any, status) {
        responseStatus = status;
        return this;
      }),
      json: vi.fn(function(this: any, json) {
        responseJson = json;
        return this;
      }),
      send: vi.fn(function(this: any) {
        return this;
      }),
    };
  });

  it("should create a user successfully", async () => {
    mockRequest = {
      method: "POST",
      body: {email: "test@example.com", password: "password123"},
    };

    mockCreateUser.mockResolvedValue({uid: "123", email: "test@example.com"});
    mockSet.mockResolvedValue({});
    mockGenerateLink.mockResolvedValue("http://verify.link");

    await register(mockRequest as Request, mockResponse as Response);

    expect(responseStatus).toBe(201);
    expect(responseJson.uid).toBe("123");
    expect(mockSet).toHaveBeenCalledWith({
      email: "test@example.com",
      createdAt: "MOCK_TIMESTAMP",
      updatedAt: "MOCK_TIMESTAMP",
      status: "unconfirmed",
      emailVerified: false,
    });
  });

  it("should return 400 if email or password are not provided", async () => {
    mockRequest = {
      method: "POST",
      body: {email: "test@example.com"},
    };

    await register(mockRequest as Request, mockResponse as Response);

    expect(responseStatus).toBe(400);
  });

  it("should return 409 if email already exists", async () => {
    mockRequest = {
      method: "POST",
      body: {email: "test@example.com", password: "password123"},
    };

    mockCreateUser.mockRejectedValue({code: "auth/email-already-exists"});

    await register(mockRequest as Request, mockResponse as Response);

    expect(responseStatus).toBe(409);
  });
});
