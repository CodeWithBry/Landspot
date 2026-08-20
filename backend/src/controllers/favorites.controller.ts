import { Request, Response } from "express";
import { sendError, sendResponse } from "../utils/response";
import { pool } from "../db";



export async function getFavorites(req: Request, res: Response) {
    try {
        const query = `
            SELECT 
                l.id,
                l.agent_id,
                l.title,
                l.description,
                l.property_type,
                l.price,
                l.bedrooms,
                l.bathrooms,
                l.address,
                l.lat,
                l.lng,
                l.status,
                l.created_at,
                CASE 
                    WHEN COUNT(li.id) = 0 THEN '[]'::json
                    ELSE json_agg(
                        json_build_object(
                            'id',                   li.id,
                            'cloudinary_url',       li.cloudinary_url,
                            'cloudinary_public_id', li.cloudinary_public_id,
                            'display_order',        li.display_order
                        ) ORDER BY li.display_order
                    )
                END AS images
            FROM listings l
            LEFT JOIN listing_images li ON li.listing_id = l.id
            JOIN favorites f ON f.user_id = $1
            WHERE li.listing_id = f.listing_id
            GROUP BY l.id;
        `
        const result = await pool.query(query, [req.user!.userId]);
        sendResponse(res, result.rows);
    } catch (error) {
        console.log(error);
        if (error instanceof Error) sendError(res, error.message);
    }
}

export async function addFavorite(req: Request, res: Response) {
    try {
        const { listing_id } = req.params;
        const query = `
            INSERT INTO favorites (user_id, listing_id) 
            VALUES ($1, $2)
        `;
        await pool.query(query, [req.user!.userId, listing_id]);
    } catch (error) {
        console.log(error);
        if (error instanceof Error) sendError(res, error.message);
    }
}

export async function removeFavorite(req: Request, res: Response) {
    try {
        const { listing_id } = req.params;
        const query = `
            DELETE FROM favorites WHERE user_id = $1 AND listing_id = $2
        `
        await pool.query(query, [req.user!.userId, listing_id]);
    } catch (error) {
        console.log(error);
        if (error instanceof Error) sendError(res, error.message);
    }
}