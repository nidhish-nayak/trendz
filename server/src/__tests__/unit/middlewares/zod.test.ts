import { Request, Response } from "express";
import { z } from "zod";
import { zodMiddleware } from "../../../middlewares/zod.middleware";

describe("Zod middleware test", () => {
    it("returns 400 for invalid inputs", () => {
        const schema = z.object({
            name: z.string(),
            age: z.number(),
        });

        const req: Request = {
            body: {
                name: "John", // valid string
                age: "twenty", // invalid string
            },
        } as Request;

        const res: Response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;

        const validationResult = schema.safeParse(req.body);
        if (!validationResult.success) {
            zodMiddleware(validationResult.error, req, res, jest.fn());
        }

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                fieldErrors: {
                    age: ["Expected number, received string"],
                },
                formErrors: [],
            },
        });
    });

    it("returns 400 for Error request", () => {
        const regularError = new Error("Regular error message");
        const req: Request = {} as Request;
        const res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        zodMiddleware(regularError, req, res as Response, jest.fn());
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Regular error message",
        });
    });

    it("returns 500 for server error", () => {
        const unknownError = "Unknown error";
        const req: Request = {} as Request;
        const res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        zodMiddleware(unknownError, req, res as Response, jest.fn());
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Internal server error",
        });
    });
});
