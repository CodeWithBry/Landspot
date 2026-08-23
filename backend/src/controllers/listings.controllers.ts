import { Request, Response } from "express";
import { pool } from "../db";
import { sendError, sendResponse } from "../utils/response";
import { registerGeocodeUsingGeoapify } from "../services/geocodeService";
import { deleteImage } from "../services/cloudinaryServices";

export const getAgentById = async (req: Request, res: Response) => {
    try {
        const { agent_id } = req.params;
        const query = `
            SELECT email, user_name FROM users WHERE id = $1;
        `
        const result = await pool.query(query, [agent_id]);
        if (result.rows) {
            sendResponse(res, result.rows[0]);
        }
    } catch (error) {
        console.log(error);
        if (error instanceof Error) sendError(res, error.message);
    }
}

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
                ) FILTER (WHERE li.id IS NOT NULL), '[]'
            ) AS images
            FROM listings l
            LEFT JOIN listing_images li ON li.listing_id = l.id
            WHERE 
                l.created_at > $1
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
    const { listing_id, user_id } = req.body;
    try {
        const query = `
            SELECT 
                l.id,
                l.agent_name,
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
                    ) FILTER (WHERE li.id IS NOT NULL), '[]'
                ) AS images,
            u.email,
            EXISTS (
                SELECT 1 
                FROM favorites f 
                WHERE f.listing_id = l.id AND f.user_id = $2
            ) AS is_favorite
            FROM listings l
            LEFT JOIN listing_images li ON li.listing_id = l.id
            INNER JOIN users u ON l.agent_id = u.id
            WHERE l.id = $1
            GROUP BY l.id, 
                     l.agent_name,
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
                     u.email;`;
        const result = await pool.query(query, [listing_id, req.user!.userId]);
        const checkIfInFavorites = await pool.query(`SELECT * FROM favorites WHERE listing_id = $1 AND user_id = $2`, [result.rows[0].id, user_id])
        const data = [{ ...result.rows[0], agent_email: result.rows[0].email, isFavorite: checkIfInFavorites.rows[0] ? true : false }]
        sendResponse(res, data);
    } catch (error) {
        console.log(error)
        if (error instanceof Error) sendError(res, error.message);
    }
}

export const getListingsOnBound = async (req: Request, res: Response) => {
    const { west, east, north, south } = req.body;
    const query = `
        SELECT 
            l.id,
            l.agent_name,
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
                ) FILTER (WHERE li.id IS NOT NULL), '[]'
            ) AS images
            FROM listings as l
            LEFT JOIN listing_images li ON li.listing_id = l.id
            WHERE l.lat BETWEEN $1 AND $2
            AND l.lng BETWEEN $3 AND $4
            GROUP BY l.id;
    `
    try {
        const response = await pool.query(query, [south, north, west, east]);
        if (response.rows.length > 0) {
            sendResponse(res, response.rows);
            return;
        }
    } catch (error) {
        console.log(error)
        sendError(res, "Error fetching listings");
    }
};

export const loadListingInitially = async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT 
                l.id,
                l.agent_id,
                l.agent_name,
                l.agent_email,
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
                            'id', li.id,
                            'cloudinary_url', li.cloudinary_url,
                            'cloudinary_public_id', li.cloudinary_public_id,
                            'display_order', li.display_order
                        )
                        ORDER BY li.display_order
                    ) FILTER (WHERE li.id IS NOT NULL),
                    '[]'
                ) AS images,
                EXISTS (
                    SELECT 1 
                    FROM favorites f 
                    WHERE f.listing_id = l.id AND f.user_id = $1
                ) AS is_favorite
            FROM listings l
            LEFT JOIN listing_images li ON li.listing_id = l.id
            GROUP BY l.id
            ORDER BY l.created_at DESC
            LIMIT 1;
        `;
        const result = await pool.query(query, [req.user!.userId]);
        if (result.rows.length) {
            sendResponse(res, [...result.rows]);
            return;
        }
        sendResponse(res, "End of the Lists.")
    } catch (err) {
        if (err instanceof Error) sendError(res, err.message);
        throw err
    }
}

export const loadListings = async (req: Request, res: Response) => {
    try {
        const { property_type, min_price,
            max_price, bedrooms,
            bathrooms, status,
            search_value, last_item } = req.body;
        const query = `
            SELECT 
                l.id,
                l.agent_id,
                l.agent_name,
                l.agent_email,
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
                            'id', li.id,
                            'cloudinary_url', li.cloudinary_url,
                            'cloudinary_public_id', li.cloudinary_public_id,
                            'display_order', li.display_order
                        )
                        ORDER BY li.display_order
                    ) FILTER (WHERE li.id IS NOT NULL),
                    '[]'
                ) AS images,
                EXISTS (
                    SELECT 1 
                    FROM favorites f 
                    WHERE f.listing_id = l.id AND f.user_id = $9
                ) AS is_favorite
            FROM listings l
            LEFT JOIN listing_images li ON li.listing_id = l.id
            WHERE
                ($1 = 'any' OR l.property_type = $1)
                AND ($2 = 0 OR l.price >= $2)
                AND ($3 = 0 OR l.price <= $3)
                AND ($4 = 0 OR l.bedrooms = $4)
                AND ($5 = 0 OR l.bathrooms = $5)
                AND l.status = $6
                AND (
                    $7::text IS NULL
                    OR l.title ILIKE '%' || $7 || '%'
                    OR l.description ILIKE '%' || $7 || '%'
                )
                AND (
                    $8::timestamptz IS NULL 
                    OR l.created_at < $8
                )
            GROUP BY l.id
            ORDER BY l.created_at DESC
            LIMIT 1;
        `;
        const result = await pool.query(query, [property_type, min_price, max_price, bedrooms, bathrooms, status, search_value, last_item?.created_at, req.user!.userId]);
        if (result.rows.length) {
            sendResponse(res, [...result.rows]);
            return;
        }
        sendResponse(res, "End of the Lists.")
    } catch (err) {
        console.log(err)
        if (err instanceof Error) sendError(res, err.message);
        throw err
    }
}

export const getAgentListing = async (req: Request, res: Response) => {
    const { user, last_item } = req.body;
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
            LEFT JOIN listing_images li ON li.listing_id = l.id
            WHERE 
                l.agent_id = $1 
                AND (
                    $2::timestamptz IS NULL 
                    OR l.created_at < $2
                )
            GROUP BY l.id
            ORDER BY l.created_at DESC
            LIMIT 1;
        ;`;
    try {
        const result = await pool.query(query, [user.id, last_item?.created_at])
        if(result.rows.length) {
            sendResponse(res, [...result.rows]);
            return;
        }
        sendResponse(res, "End of the Lists.")
    } catch (err) {
        if (err instanceof Error) sendError(res, err.message);
        throw err
    }
}

export const createNewListing = async (req: Request, res: Response) => {
    const { title, description, property_type, price, bedrooms, bathrooms, address, lat, lng, agent_email, agent_name } = req.body;
    try {
        if (!lat) {
            sendError(res, "NO COORDINATES!")
            return;
        }

        let query = `
            INSERT INTO listings(agent_id, title, description, property_type, price, bedrooms, bathrooms, address, lat, lng, agent_name, agent_email)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *
        `;
        const result = await pool.query(query, [req?.user!.userId, title, description, property_type, price, bedrooms, bathrooms, address, lat, lng, agent_name, agent_email]);
        sendResponse(res, result.rows[0])
    } catch (error) {
        if (error instanceof Error) sendError(res, error.message);
        throw error
    }
}

export const deleteListing = async (req: Request, res: Response) => {
    const { user_id } = req.body;
    const { params } = req.params;
    try {
        const query = `
            DELETE FROM listings
            WHERE id = $1 AND agent_id = $2; 
        `
        await pool.query(query, [params, user_id])
    } catch (error) {
        if (error instanceof Error) sendError(res, error.message);
        throw error;
    }
}

export const updateListing = async (req: Request, res: Response) => {
    const { listing } = req.body;
    const {
        title,
        description,
        property_type,
        price,
        bedrooms,
        bathrooms,
        lat,
        lng,
        address,
        status,
        agent_id,
        id
    } = listing;
    try {
        const query = `
            UPDATE listings
            SET title = $1,
                description = $2,
                property_type = $3,
                price = $4,
                bedrooms = $5,
                bathrooms = $6,
                address = $7,
                lat = $8,
                lng = $9,
                status = $10
            WHERE agent_id = $11
            AND id = $12
            RETURNING *;
        `
        const result = await pool.query(query, [title, description, property_type, price, bedrooms, bathrooms, address, lat, lng, status, agent_id, id]);
        if (result.rows) {
            sendResponse(res, result.rows);
        }
    } catch (error) {
        console.log(error)
        if (error instanceof Error) sendError(res, error.message)
    }
}

export const deleteFromListingImages = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { public_id } = req.body;
    try {
        const query = `
            DELETE FROM listing_images
            WHERE id = $1;
        `
        await pool.query(query, [id]);
        deleteImage(public_id);
    } catch (error) {
        if (error instanceof Error) sendError(res, error.message)
    }
}

export async function searchListings(req: Request, res: Response) {
    const { params } = req.params;
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
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', li.id,
                            'cloudinary_url', li.cloudinary_url,
                            'cloudinary_public_id', li.cloudinary_public_id,
                            'display_order', li.display_order
                        )
                        ORDER BY li.display_order
                    ) FILTER (WHERE li.id IS NOT NULL),
                    '[]'
                ) AS images
            FROM listings AS l
            LEFT JOIN listing_images li
                ON li.listing_id = l.id
            WHERE
                l.title ILIKE $1
                OR l.description ILIKE $1
            GROUP BY l.id
            ORDER BY l.created_at DESC
        `;
        const keyword = `%${params}%`
        const result = await pool.query(query, [keyword]);
        const data = result.rows;
        console.log(data)
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