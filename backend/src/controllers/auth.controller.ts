import { Request, Response } from 'express'
import { pool } from '../db';
import bcrypt from 'bcryptjs';
import { sendError, sendResponse } from '../utils/response';
import { signToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
    const { email, user_name, password, role } = req.body;
    const client = await pool.connect();
    try {
        // TEST USER IF THE REGISTERED ACCOUNT IS ALREADY IN THE DATABASE.
        await client.query("BEGIN");
        const ifUserAlreadyExists = await pool.query(`SELECT user_name FROM users WHERE email = $1`, [email]);
        if (ifUserAlreadyExists.rows.length == 0) {

            const createHashPassword = await bcrypt.hash(password, 12);
            const userResultId = await client.query(`
                INSERT INTO users (user_name, email, password_hash, role)
                VALUES ($1, $2, $3, $4)
                RETURNING id, role;
            `, [user_name, email, createHashPassword, role]);
            const getUserData = userResultId.rows[0];
            await client.query(`
                INSERT INTO profiles (user_id, email, role)
                VALUES ($1, $2, $3);
            `, [getUserData.id, email, getUserData.role])
            await client.query("COMMIT");

            return sendResponse(res, { mess: "Successfully Created an Account!" });
        }

        return sendResponse(res, { mess: "Email is already used!" });
    } catch (error) {
        sendError(res, "Error occurred");
        await client.query("ROLLBACK;");
        throw error;
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    // console.log(email, password)
    try {
        const getUserByEmail = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
        const user = getUserByEmail.rows[0];

        if (!user) {
            return sendError(res, "Account does not exist!");
        }

        const matchHashPassword = await bcrypt.compare(password, user.password_hash);

        if (!matchHashPassword) {
            console.log(matchHashPassword)
            return sendError(res, 'Email or Password is not correct. Try again');
        }

        const token = signToken({ userId: user.id, role: user.role });
        sendResponse(res, {
            user: { id: user.id, name: user.user_name, email: user.email, role: user.role },
            token
        });
    } catch (error) {
        throw error
    }
}

export const getUser = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT id, user_name, email, role, created_at FROM users WHERE id = $1',
            [req.user!.userId]
        );
        if (!result.rows.length) {
            sendError(res, 'User not found', 404);
            return;
        }
        sendResponse(res, result.rows[0]);
    } catch (error) {
        throw error
    }
}

export const getProfile = async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT 
                p.user_id,
                p.profile_id,
                p.role,
                p.email,
                p.first_name,
                p.last_name,
                p.phone_number,
                p.bio,
                p.facebook_acc,
                pi.photo_url AS photo_url,
                u.user_name
            FROM profiles p
            LEFT JOIN profile_images pi 
                ON pi.profile_id = p.profile_id
            JOIN users u 
                ON u.id = p.user_id
            WHERE p.user_id = $1;
        `;
        const result = await pool.query(query, [req.user!.userId]);

        if (!result.rows.length) {
            sendError(res, 'User not found', 404);
            return;
        }
        sendResponse(res, result.rows[0]);
    } catch (error) {
        if (error instanceof Error) sendError(res, error.message);
        throw error;
    }
}

export const updateProfile = async (req: Request, res: Response) => {
    const {
        user_name,
        email,
        first_name,
        last_name,
        phone_number,
        bio,
        agent_description,
        facebook_acc
    } = req.body;
    console.log(req.body);
    try {
        const query = `
                UPDATE profiles
                SET email = $1,
                    first_name = $2,
                    last_name = $3,
                    phone_number = $4,
                    bio = $5,
                    agent_description = $6,
                    facebook_acc = $7
                WHERE user_id = $8
            `
        await pool.query(query, [
            email,
            first_name,
            last_name,
            phone_number,
            bio,
            agent_description,
            facebook_acc, req.user!.userId
        ]);
        await pool.query(`
                UPDATE users
                SET user_name = $1 
                WHERE id = $2
            `, [user_name, req.user!.userId]);
        sendResponse(res, "Profile Updated Successfully.");
    } catch (error) {
        if (error instanceof Error) sendError(res, error.message);
        throw error;
    }
} 