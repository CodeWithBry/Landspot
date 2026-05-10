/// <reference path="./types/express.d.ts" />
import express from "express";
import cors from "cors";
import "dotenv/config";
import AuthRouter from "./routes/authRoute";
import ListingsRouter from "./routes/listingsRoute";
import CloudinaryRouter from "./routes/cloudinaryRoute";

export const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }))
app.use(express.json())


app.use('/api/auth', AuthRouter);
app.use('/api/listings', ListingsRouter);
app.use('/api/cloudinary', CloudinaryRouter);
// app.use('/api/list', )
// app.use('/api/favorites', )