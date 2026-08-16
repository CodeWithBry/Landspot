import { Response, Request, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
import { pool } from "../db";
import { sendError, sendResponse } from "../utils/response";
import { RejectType, ResolveType, UploadResult } from "../types/cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

function uploadProcess(file: Express.Multer.File, folder: string, resolve: ResolveType, reject: RejectType) {
    cloudinary.uploader.upload_stream(
        {
            folder: folder,
            resource_type: 'image'
        },
        (err, result) => {
            if (err || !result) return reject(err);
            resolve({
                secure_url: result.secure_url,
                public_id: result.public_id,
                created_at: result.created_at
            })
        }
    ).end(file.buffer);
}

export async function uploadProfile(req: Request, res: Response) {
    const { profile_id } = req.params;
    try {
        const file = req.file as Express.Multer.File;
        const uploadResult = await new Promise<UploadResult>(
            (resolve, reject) => uploadProcess(file, `landspot/profiles/${req.user?.userId}`, resolve, reject)
        )
        const isAlreadyHavePhoto = await pool.query(`SELECT public_id FROM profile_images WHERE profile_id = $1`, [profile_id]);
        if (isAlreadyHavePhoto.rows.length) {
            await deleteExistingProfileImage(isAlreadyHavePhoto.rows[0].public_id, req, res);
        }

        const query = `
                INSERT INTO profile_images (profile_id, public_id, photo_url, created_at)
                VALUES ($1, $2, $3, $4)
                RETURNING photo_url;
            `;
        const result = await pool.query(query, [profile_id, uploadResult.public_id, uploadResult.secure_url, uploadResult.created_at]);
        sendResponse(res, result.rows[0]);
    } catch (error) {
        if (error instanceof Error) sendError(res, error.message);
        throw error;
    }
}

export async function uploadFiles(req: Request, res: Response) {
    const files = req.files as Express.Multer.File[];
    const { listing_id } = req.body;
    try {
        if (!files.length) {
            sendError(res, "No Files Uploaded!");
            return;
        }

        const countResult = await pool.query<{ count: string }>(`
                SELECT COUNT(*) FROM listing_images WHERE listing_id = $1;
            `, [listing_id]);

        let displayOrder = parseInt(countResult.rows[0].count);

        const uploaded = await Promise.all(
            files.map(async (file) => {
                const uploadResult = await new Promise<UploadResult>(
                    (resolve, reject) => uploadProcess(file, `landspot/listings/${listing_id}`, resolve, reject)
                )

                const result = await pool.query(`INSERT INTO listing_images(listing_id, cloudinary_url, cloudinary_public_id, display_order)
                    VALUES ($1, $2, $3, $4) RETURNING *`, [listing_id, uploadResult.secure_url, uploadResult.public_id, displayOrder]);

                return result.rows[0];

            })
        )
        sendResponse(res, uploaded);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const deleteExistingProfileImage = async (public_id: string, req: Request, res: Response) => {
    if (!public_id) {
        sendError(res, 'publicId is required');
        return
    }

    await cloudinary.uploader.destroy(public_id);
    await pool.query(`
        DELETE FROM profile_images
        WHERE public_id = $1
    `, [public_id]);
}

export const deleteListingImage = async (
    req: Request,
    res: Response
) => {
    const { publicId } = req.body as { publicId?: string }

    if (!publicId) {
        sendError(res, 'publicId is required')
        return
    }

    try {
        await cloudinary.uploader.destroy(publicId)
        await pool.query(
            'DELETE FROM listing_images WHERE cloudinary_public_id = $1',
            [publicId]
        )
        sendResponse(res, { message: 'Image deleted' })
    } catch (err) {
        throw err
    }
}