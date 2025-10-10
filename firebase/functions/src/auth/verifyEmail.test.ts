import {describe, it, expect, vi, beforeEach} from "vitest";
import {verifyEmail} from "./verifyEmail";
import {Request, Response} from "firebase-functions/v1";

const mockApplyActionCode = vi.fn();
const mockGetUserByEmail = vi.fn();
const mockUpdate = vi.fn();

vi.mock("firebase-admin", () => ({
  initializeApp: vi.fn(),
  auth: () => ({
    applyActionCode: mockApplyActionCode,
    getUserByEmail: mockGetUserByEmail,
  }),
  firestore: Object.assign(vi.fn(() => ({
    collection: () => ({
      doc: () => ({
        update: mockUpdate,
      }),
    }),
  })), {
    FieldValue: {
      serverTimestamp: vi.fn(() => "MOCK_TIMESTAMP"),
    },
  }),
}));

describe("verifyEmail function", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseStatus: number;
  let redirectUrl: string;

  beforeEach(() => {
    vi.clearAllMocks();
    responseStatus = 0;
    redirectUrl = "";

    mockResponse = {
      status: vi.fn(function(this: any, status) {
        responseStatus = status;
        return this;
      }),
      redirect: vi.fn(function(this: any, url) {
        redirectUrl = url;
        return this;
      }),
      send: vi.fn(function(this: any) {
        return this;
      }),
    };
  });

  it("should verify email and update user status", async () => {
    mockRequest = {
      query: {oobCode: "validCode"},
    };

    mockApplyActionCode.mockResolvedValue({data: {email: "test@example.com"}});
    mockGetUserByEmail.mockResolvedValue({uid: "123"});
    mockUpdate.mockResolvedValue({});

    await verifyEmail(mockRequest as Request, mockResponse as Response);

    expect(redirectUrl).toBe("/verification-success");
    expect(mockUpdate).toHaveBeenCalledWith({
      emailVerified: true,
      status: "active",
      updatedAt: "MOCK_TIMESTAMP",
    });
  });

  it("should return 400 for invalid oobCode", async () => {
    mockRequest = {
      query: {oobCode: "12345"}, // Invalid type
    };

    await verifyEmail(mockRequest as Request, mockResponse as Response);

    expect(responseStatus).toBe(400);
  });

  it("should redirect to failure page if action code is invalid", async () => {
    mockRequest = {
      query: {oobCode: "invalidCode"},
    };

    mockApplyActionCode.mockRejectedValue(new Error("Invalid code"));

    await verifyEmail(mockRequest as Request, mockResponse as Response);

    expect(redirectUrl).toBe("/verification-failure");
  });
});
