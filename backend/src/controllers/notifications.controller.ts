import { Response, Request } from "express";
import { sendResponse, sendError } from "../utils/response";
import transporter from "../middleware/nodemailer";
import { pool } from "../db";
export async function sendMail(req: Request, res: Response) {
    const { html, subject, message, agent_email, agent_id, sender_email, sender_id, sender_name } = req.body;
    try {
        await pool.query(`
                INSERT INTO notifications (title, message_description, sender_email, sender_id, sender_name, user_id, html)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, [subject, message, sender_email, sender_id, sender_name, agent_id, html]);
        const info = await transporter.sendMail({
            from: sender_email,
            to: agent_email,
            subject,
            html,
        });
        sendResponse(res, info);
    } catch (error) {
        console.log("Error send email", error)
        if (error instanceof Error) sendError(res, error.message);
    }
}

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.body;
        const result = await pool.query(`
            SELECT * FROM notifications WHERE user_id = $1
            ORDER BY sent_at DESC
            LIMIT 10
        `, [user_id])
        sendResponse(res, result.rows);
    } catch (error) {
        if (error instanceof Error) sendError(res, error.message);
        throw error;
    }
}

export const getNotificationById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const query = `SELECT * FROM notifications WHERE id = $1`;
        const result = await pool.query(query, [id]);
        if(result.rows.length != 0) {
            sendResponse(res, result.rows[0]);
            return;
        }
        sendError(res, "Error: Notification not founded.");
    } catch (error) {
        if (error instanceof Error) sendError(res, error.message);
        throw error;
    }
};