import { Request, Response } from "express";
import { sendError, sendResponse } from "../utils/response";
import transporter from "../middleware/nodemailer";
import { pool } from "../db";
export async function sendMail(req: Request, res: Response) {
    const { html, subject, agent_id, agent_email } = req.body;
    try {
        const { rows } = await pool.query(`SELECT email FROM users WHERE id = $1`, [agent_id]);
        if (rows[0]) {
            console.log(rows[0].email)
            const info = await transporter.sendMail({
                from: "sarahmae.delacruz@deped.gov.ph",
                to: rows[0].email,
                subject,
                html,
            });

            sendResponse(res, info);
        }
    } catch (error) {
        console.log("Error send email", error)
        if (error instanceof Error) sendError(res, error.message);
    }
}