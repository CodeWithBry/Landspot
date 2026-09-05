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
                RETURNING user_name, id, role;
            `, [user_name, email, createHashPassword, role]);
            const getUserData = userResultId.rows[0];
            await client.query(`
                INSERT INTO profiles (user_id, user_name, email, role)
                VALUES ($1, $2, $3, $4);
            `, [getUserData.id, getUserData.user_name, email, getUserData.role])
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
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        sendResponse(res, {
            user
        });
    } catch (error) {
        if (error instanceof Error) sendError(res, error.message);
        throw error;
    }
}

export const logOut = async (req: Request, res: Response) => {
    try {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        sendResponse(res, "Logged out successfully")
    } catch (error) {
        if (error instanceof Error) sendError(res, error.message);
        throw error;
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
        instagram_acc,
        linkedin_acc,
        website_link,
        facebook_acc
    } = req.body;
    try {
        const query = `
                UPDATE profiles
                SET email = $1,
                    first_name = $2,
                    last_name = $3,
                    phone_number = $4,
                    bio = $5,
                    facebook_acc = $6,
                    instagram_acc = $7,
                    linkedin_acc = $8,
                    website_link = $9
                WHERE user_id = $10
            `
        await pool.query(query, [
            email,
            first_name,
            last_name,
            phone_number,
            bio,
            facebook_acc,
            instagram_acc,
            linkedin_acc,
            website_link,
            req.user!.userId
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
                p.instagram_acc,
                p.linkedin_acc,
                p.website_link,
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

export const getUsers = async (req: Request, res: Response) => {
    try {
        console.log("GET USERS START");
        const { last_item, follower_profile_id } = req.body;
        const query = `
            SELECT p.*,
                   pi.public_id,
                   pi.photo_url,
                   (
                        SELECT COUNT(*)
                        FROM followers f
                        WHERE f.profile_id = p.profile_id
                   ) AS followers,
                   EXISTS (
                        SELECT 1 FROM followers f
                        WHERE f.profile_id = p.profile_id AND (
                            $1::UUID IS NOT NULL 
                            AND f.follower_profile_id = $1 
                        )
                   ) AS followed
            FROM profiles p
            LEFT JOIN profile_images pi ON p.profile_id = pi.profile_id
            WHERE (
                    $2::timestamptz IS NULL 
                    OR p.created_at < $2
                ) AND (
                    $1::UUID IS NULL
                    OR p.profile_id != $1 
                )
            ORDER BY p.created_at DESC
            LIMIT 10;
        `;
        const result = await pool.query(query, [follower_profile_id, last_item?.created_at]);

        console.log("GET USERS QUERY FINISHED");
        if (result.rows.length) {
            sendResponse(res, result.rows);
            return;
        }
        sendResponse(res, "End of the Lists.");
    } catch (error) {
        console.log("GET USERS ERROR", error);
        if (error instanceof Error) sendError(res, error.message);
        throw error;
    }
}

export const follow = async (req: Request, res: Response) => {
    try {
        const { follower_id, followed_id } = req.body;
        const query = `
            INSERT INTO followers(follower_profile_id, profile_id) 
            VALUES ($1, $2);
        `;
        await pool.query(query, [follower_id, followed_id]);
        sendResponse(res, "Success")
    } catch (error) {
        if (error instanceof Error) sendError(res, error.message);
        throw error;
    }
}

export const unFollow = async (req: Request, res: Response) => {
    try {
        const { follower_id, followed_id } = req.body;
        console.log(follower_id, followed_id)
        const query = `
            DELETE FROM followers
            WHERE follower_profile_id = $1 AND profile_id = $2;
        `;
        await pool.query(query, [follower_id, followed_id]);
        sendResponse(res, "Success")
    } catch (error) {
        if (error instanceof Error) sendError(res, error.message);
        throw error;
    }
}