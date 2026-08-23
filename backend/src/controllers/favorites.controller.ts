import { Request, Response } from "express";
import { sendError, sendResponse } from "../utils/response";
import { pool } from "../db";
import { Listing } from "../types/listings";



export async function getFavorites(req: Request, res: Response) {
    const body = req.body as {last_item: Listing} | null;
    const last_item = body?.last_item ?? null;
    console.log(last_item?.created_at)
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
                f.created_at,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', li.id,
                            'cloudinary_url', li.cloudinary_url,
                            'cloudinary_public_id', li.cloudinary_public_id,
                            'display_order', li.display_order
                        ) ORDER BY li.display_order
                    ) FILTER (WHERE li.id IS NOT NULL),
                    '[]'::json
                ) AS images
            FROM listings l
            LEFT JOIN listing_images li ON li.listing_id = l.id
            JOIN favorites f ON f.user_id = $1
            WHERE 
                li.listing_id = f.listing_id
                AND (
                    $2::timestamptz IS NULL 
                    OR f.created_at < $2
                )
            GROUP BY l.id, f.created_at
            LIMIT 1;
        `
        const result = await pool.query(query, [req.user!.userId, last_item?.created_at]);
        if(result.rows.length) {
            sendResponse(res, result.rows);
            return;
        }

        sendResponse(res, "End of the Lists.")
    } catch (error) {
        console.log(error);
        if (error instanceof Error) sendError(res, error.message);
    }
}

export async function addFavorite(req: Request, res: Response) {
    try {
        const { listing_id } = req.params;
        const isAlreadyAdded = (await pool.query(`
            INSERT INTO favorites (user_id, listing_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id, listing_id)
            DO NOTHING
            RETURNING *;     
        `, [req.user!.userId, listing_id])).rows.length;
        sendResponse(res, "Added to Favorites successfully!");
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
        console.log("DELETE!")
        await pool.query(query, [req.user!.userId, listing_id]);
        sendResponse(res, "Added to Favorites successfully!");
    } catch (error) {
        console.log(error);
        if (error instanceof Error) sendError(res, error.message);
    }
}