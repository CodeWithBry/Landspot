import { Request, Response } from "express";
import { pool } from "../db";
import { sendError, sendResponse } from "../utils/response";
import { registerGeocode, registerGeocodeUsingGeoapify } from "../services/geocodeService";

export const getListings = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM listings;`);
        sendResponse(res, [...result.rows]);
    } catch (err) {
        console.log(err)
        throw err
    }
}

export const loadListings = async (req: Request, res: Response) => {
    const { targetMin, targetMax } = req.body;
    try {
        const result = await pool.query(`SELECT * FROM listings WHERE num_id >= $1 AND num_id <= $2;`, [targetMin, targetMax]);
        console.log(result.rows)
        sendResponse(res, [...result.rows]);
    } catch (err) {
        console.log(err)
        throw err
    }
}

export const getAgentListing = async (req: Request, res: Response) => {
    const { user } = req.body;
    let query = `
        SELECT * FROM listings WHERE agent_id = $1;
    `
    try {
        const result = await pool.query(query, [user.id])
        sendResponse(res, result.rows)
    } catch (err) {
        console.log(err)
        throw err
    }
}

export const createNewListing = async (req: Request, res: Response) => {
    const { title, description, property_type, price, bedrooms, bathrooms, address } = req.body;
    try {
        const geo = await registerGeocodeUsingGeoapify(address);
        if (!geo) {
            console.log("ERROR IN GEOCODING!")
            sendError(res, "GEOCODE DIDN'T REGISTERED, TRY A MORE SPECIFIC ADDRESS!")
            return;
        }
        let query = `
            INSERT INTO listings(agent_id, title, description, property_type, price, bedrooms, bathrooms, address, lat, lng)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `;
        const result = await pool.query(query, [req?.user!.userId, title, description, property_type, price, bedrooms, bathrooms, address, geo.lat, geo.lng]);
        sendResponse(res, result.rows[0])
    } catch (error) {
        console.log("ERROR REVEAL: " + error);
        if (error instanceof Error) sendError(res, error.message);
    }
}

export async function searchListings(req: Request, res: Response) {
    const { searchParams } = req.body;
    try {
        const query = `
            SELECT agent_id, title, description, property_type, price, bedrooms, bathrooms, address, lat, lng from listings 
            WHERE title = $1 OR bathrooms = $2 OR address = $3
        `;

        const result = await pool.query(query, [searchParams, searchParams, searchParams]);
        const data = result.rows;
        if (data.length) {
            sendResponse(res, data);
        }

        return { message: "Listing not found" };
    } catch (error) {
        console.log(error)
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
        sendResponse(res, "ok")
    } catch (error) {
        console.log(error);
    }
}