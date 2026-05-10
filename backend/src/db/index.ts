import { Pool } from "pg";

export const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "Landspot",
    password: "postgresql",
    port: 5432,
})

// export const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.NODE_ENV === 'production'
//     ? { rejectUnauthorized: false }
//     : { rejectUnauthorized: false }
// })