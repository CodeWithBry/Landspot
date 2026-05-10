import { Pool } from "pg";

export const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "Landspot",
    password: "postgresql",
    port: 5432,
})