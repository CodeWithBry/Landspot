import { Response, Request } from "express";
import { v2 as cloudinary } from "cloudinary";
import { pool } from "../db";
import { sendError, sendResponse } from "../utils/response";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function uploadFiles(req: Request, res: Response) {
    const files = req.files as Express.Multer.File[];
    const {listing_id} = req.body;
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
                const uploadResult = await new Promise<{ secure_url: string, public_id: string }>(
                    (resolve, reject) => {
                        cloudinary.uploader.upload_stream(
                            {
                                folder: `landspot/listings/${listing_id}`,
                                resource_type: 'image'
                            },
                            (err, result) => {
                                if (err || !result) return reject(err);
                                resolve({
                                    secure_url: result.secure_url,
                                    public_id: result.public_id
                                })
                            }
                        ).end(file.buffer);
                    }
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

export const deleteListingImage = async (
    req: Request,
    res: Response
): Promise<void> => {
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