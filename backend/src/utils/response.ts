import { Response } from "express";

export async function sendResponse(res: Response, data: unknown, status = 200) {
    return res.status(status).json({data})
}

export async function sendError(res: Response, mess: string, status = 400) {
    return res.status(status).json({mess})
}