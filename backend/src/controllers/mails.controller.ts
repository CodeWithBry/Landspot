import { Response, Request } from "express";
import { sendResponse, sendError } from "../utils/response";
import { pool } from "../db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMail(req: Request, res: Response) {
    const { html, subject, message_description, agent_name, agent_email, user_id, sender_email, sender_id, sender_name } = req.body;
    try {
        const info = await Promise.race([
            resend.emails.send({
                from: "onboarding@resend.dev",
                to: agent_email,
                subject,
                html
            }),

            new Promise((_, reject) => setTimeout(() => {
                () => reject(new Error("Email sending timed out after 1 minute."));
            }, 60 * 1000))
        ]);

        await pool.query(`
                INSERT INTO mails (html, subject, message_description, agent_name, agent_email, user_id, sender_email, sender_id, sender_name)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `, [html, subject, message_description, agent_name, agent_email, user_id, sender_email, sender_id, sender_name]);
        sendResponse(res, info);
    } catch (error) {
        console.log("Error send email", error)
        if (error instanceof Error) sendError(res, error.message);
    }
}

export const getMails = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT * FROM mails 
            WHERE user_id = $1
            ORDER BY sent_at DESC
            LIMIT 10;
        `, [req.user!.userId]);
        sendResponse(res, result.rows);
    } catch (error) {
        if (error instanceof Error) sendError(res, error.message);
        throw error;
    }
}

export const getMailById = async (req: Request, res: Response) => {
    try {
        const { mail_id } = req.params;
        const query = `SELECT * FROM mails WHERE mail_id = $1 AND user_id = $2`;
        const result = await pool.query(query, [mail_id, req.user!.userId]);
        if (result.rows.length != 0) {
            sendResponse(res, result.rows[0]);
            return;
        }
        sendError(res, "Error: Notification not founded.");
    } catch (error) {
        if (error instanceof Error) sendError(res, error.message);
        throw error;
    }
};

export const seenMail = async (req: Request, res: Response) => {
    try {
        const {mail_id} = req.params;
        const query = `
            UPDATE mails 
            SET is_seen = TRUE 
            WHERE mail_id = $1 AND user_id = $2
            RETURNING *;
        `;
        const result = await pool.query(query, [mail_id, req.user!.userId]);
        if (result.rows[0]) {
            sendResponse(res, result.rows[0]);
            return;
        }
        return;
    } catch (error) {
        if (error instanceof Error) sendError(res, error.message);
        throw error;
    }
}

export const getUnseenMailsLength = async (req: Request, res: Response) => {
    try {
        const query = `SELECT * FROM mails WHERE user_id = $1 AND is_seen = $2`;
        const result = await pool.query(query, [req.user!.userId, false]);  
        sendResponse(res, result.rows.length);
    } catch (error) {
        if (error instanceof Error) sendError(res, error.message);
        throw error;
    }
}