import { Request, Response } from "express";
import { pool } from "../db";
import { sendError, sendResponse } from "../utils/response";
import { registerGeocodeUsingGeoapify } from "../services/geocodeService";

export const getListings = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
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
            COALESCE(
            json_agg(
                json_build_object(
                'id',                   li.id,
                'cloudinary_url',       li.cloudinary_url,
                'cloudinary_public_id', li.cloudinary_public_id,
                'display_order',        li.display_order
                ) ORDER BY li.display_order
            ) FILTER (WHERE li.id IS NOT NULL),
            '[]'
            ) AS images
            FROM listings l
            LEFT JOIN listing_images li ON li.listing_id = l.id
            GROUP BY l.id
            ORDER BY l.created_at DESC
        ;`);
        sendResponse(res, [...result.rows]);
    } catch (err) {
        if (err instanceof Error) sendError(res, err.message);
        throw err
    }
}

export const getListingById = async (req: Request, res: Response) => {
    const { listing_id } = req.body;
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
            WHERE l.id = $1
            GROUP BY l.id;
        `;
        const result = await pool.query(query, [listing_id]);
        if (result.rows) {
            sendResponse(res, result.rows);
            return;
        }

        return;
    } catch (error) {
        if (error instanceof Error) sendError(res, error.message);
    }
}

export const loadListings = async (req: Request, res: Response) => {
    const { targetMin, targetMax } = req.body;
    try {
        const result = await pool.query(`SELECT * FROM listings WHERE num_id >= $1 AND num_id <= $2;`, [targetMin, targetMax]);
        sendResponse(res, [...result.rows]);
    } catch (err) {
        if (err instanceof Error) sendError(res, err.message);
        throw err
    }
}

export const getAgentListing = async (req: Request, res: Response) => {
    const { user } = req.body;
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
            COALESCE(
            json_agg(
                json_build_object(
                'id',                   li.id,
                'cloudinary_url',       li.cloudinary_url,
                'cloudinary_public_id', li.cloudinary_public_id,
                'display_order',        li.display_order
                ) ORDER BY li.display_order
            ) FILTER (WHERE li.id IS NOT NULL),
            '[]'
            ) AS images
            FROM listings l
            LEFT JOIN listing_images li ON li.listing_id = l.id AND l.agent_id = $1
            GROUP BY l.id
            ORDER BY l.created_at DESC
        ;`;
    try {
        const result = await pool.query(query, [user.id])
        sendResponse(res, result.rows)
    } catch (err) {
        if (err instanceof Error) sendError(res, err.message);
        throw err
    }
}

export const createNewListing = async (req: Request, res: Response) => {
    const { title, description, property_type, price, bedrooms, bathrooms, address, lat, lng } = req.body;
    try {
        if (!lat) {
            sendError(res, "NO COORDINATES!")
            return;
        }

        let query = `
            INSERT INTO listings(agent_id, title, description, property_type, price, bedrooms, bathrooms, address, lat, lng)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `;
        const result = await pool.query(query, [req?.user!.userId, title, description, property_type, price, bedrooms, bathrooms, address, lat, lng]);
        sendResponse(res, result.rows[0])
    } catch (error) {
        if (error instanceof Error) sendError(res, error.message);
        throw error
    }
}

export const deleteListing = async (req: Request, res: Response) => {
    const {user_id} = req.body;
    const {params} = req.params;
    try {
        const query = `
            ALTER INTO listings 
        `
    } catch (error) {
        if(error instanceof Error) sendError(res, error.message);
        throw error;
    }
} 

export async function searchListings(req: Request, res: Response) {
    const { params } = req.params;
    console.log(params)
    try {
        const query = `
            SELECT agent_id, title, description, property_type, price, bedrooms, bathrooms, address, lat, lng from listings 
            WHERE title ILIKE $1 OR description ILIKE $1;
        `;
        const keyword = `%${params}%`
        const result = await pool.query(query, [keyword]);
        const data = result.rows;
        if (data.length) {
            return sendResponse(res, data);
        }

        return sendResponse(res, { message: "Listing not found" });
    } catch (error) {
        if (error instanceof Error) sendError(res, error.message);
        throw error
    }
}

export async function testAddress(req: Request, res: Response) {
    const { address } = req.body;
    try {
        const geo = await registerGeocodeUsingGeoapify(address);
        if (!geo) {
            console.log("ERROR IN GEOCODING!")
            sendError(res, "GEOCODE DIDN'T REGISTERED, TRY A MORE SPECIFIC ADDRESS!")
            return;
        }
        sendResponse(res, geo)
    } catch (error) {
        if (error instanceof Error) sendError(res, error.message);
        throw error
    }
}