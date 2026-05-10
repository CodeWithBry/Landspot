import { Request, Response } from 'express'
import { pool } from '../db';
import bcrypt from 'bcryptjs';
import { sendError, sendResponse } from '../utils/response';
import { signToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
    const { email, name, password, role } = req.body;
    try {
        // TEST USER IF THE REGISTERED ACCOUNT IS ALREADY IN THE DATABASE.
        const ifUserAlreadyExists = await pool.query(`SELECT name FROM users WHERE email = $1`, [email]);
        if (ifUserAlreadyExists.rows.length == 0) {
            const createHashPassword = await bcrypt.hash(password, 12);
            await pool.query(`INSERT INTO users(name, email, password_hash, role) VALUES ($1, $2, $3, $4)`, [name, email, createHashPassword, role]);
            sendResponse(res, { mess: "Successfully Created an Account!" });
        }
    } catch (error) {
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
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            token
        });
    } catch (error) {
        throw error
    }
}

export const getUser = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
            [req.user!.userId]
        );
        if (!result.rows.length) {
            sendError(res, 'User not found', 404);
            return;
        }
        console.log(result.rows[0])
        sendResponse(res, result.rows[0]);
    } catch (error) {
        throw error
    }
}