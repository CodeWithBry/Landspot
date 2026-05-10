// import { Request, Response, NextFunction } from 'express'
// import multer, { FileFilterCallback } from 'multer'
// import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
// import streamifier from 'streamifier'

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// })

// const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']
// const MAX_FILE_SIZE = 5 * 1024 * 1024

// const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
//     if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
//         cb(null, true)
//     } else {
//         cb(new Error(`Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`))
//     }
// }

// export const upload = multer({
//     storage: multer.memoryStorage(),
//     limits: { fileSize: MAX_FILE_SIZE },
//     fileFilter,
// })

// const streamUpload = (
//     buffer: Buffer,
//     folder: string,
//     publicId?: string
// ): Promise<UploadApiResponse> =>
//     new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//             {
//                 folder,
//                 public_id: publicId,
//                 overwrite: true,
//                 resource_type: 'image',
//             },
//             (error, result) => {
//                 if (error || !result) return reject(error ?? new Error('Cloudinary upload failed'))
//                 resolve(result)
//             }
//         )
//         streamifier.createReadStream(buffer).pipe(stream)
//     })

// export const uploadSingle = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ): Promise<void> => {
//     try {
//         const file = req.file as Express.Multer.File | undefined

//         if (!file) {
//             res.status(400).json({ success: false, message: 'No file uploaded' })
//             return
//         }

//         const folder = (req.body.folder as string) || 'uploads'
//         const result = await streamUpload(file.buffer, folder)

//         res.status(200).json({
//             success: true,
//             url: result.secure_url,
//             publicId: result.public_id,
//             width: result.width,
//             height: result.height,
//             format: result.format,
//             bytes: result.bytes,
//         })
//     } catch (error) {
//         next(error)
//     }
// }

// export const uploadMultiple = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ): Promise<void> => {
//     try {
//         const files = req.files as Express.Multer.File[] | undefined

//         if (!files || files.length === 0) {
//             res.status(400).json({ success: false, message: 'No files uploaded' })
//             return
//         }

//         const folder = (req.body.folder as string) || 'uploads'

//         const results = await Promise.all(
//             files.map((file) => streamUpload(file.buffer, folder))
//         )

//         res.status(200).json({
//             success: true,
//             count: results.length,
//             files: results.map((r) => ({
//                 url: r.secure_url,
//                 publicId: r.public_id,
//                 width: r.width,
//                 height: r.height,
//                 format: r.format,
//                 bytes: r.bytes,
//             })),
//         })
//     } catch (error) {
//         next(error)
//     }
// }

// export const deleteFile = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ): Promise<void> => {
//     try {
//         const { publicId } = req.params

//         if (!publicId) {
//             res.status(400).json({ success: false, message: 'publicId is required' })
//             return
//         }

//         const result = await cloudinary.uploader.destroy(publicId)

//         if (result.result !== 'ok') {
//             res.status(404).json({ success: false, message: 'File not found or already deleted' })
//             return
//         }

//         res.status(200).json({ success: true, message: 'File deleted successfully' })
//     } catch (error) {
//         next(error)
//     }
// }

// export const multerErrorHandler = (
//     error: Error,
//     _req: Request,
//     res: Response,
//     next: NextFunction
// ): void => {
//     if (error instanceof multer.MulterError) {
//         if (error.code === 'LIMIT_FILE_SIZE') {
//             res.status(413).json({
//                 success: false,
//                 message: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
//             })
//             return
//         }
//         res.status(400).json({ success: false, message: error.message })
//         return
//     }

//     if (error.message.startsWith('Invalid file type')) {
//         res.status(415).json({ success: false, message: error.message })
//         return
//     }

//     next(error)
// }