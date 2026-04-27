import { app } from "./app";
import { pool } from "./db";

const PORT = process.env.PORT || 4000;


async function start() {
    try {
        const firstQuery = await pool.query('SELECT 1');
        app.get('/test', async (req, res) => res.json({ mess: 'THIS IS A MESSAGE!' }))
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`)
        })
    } catch (err) {
        console.error('Failed to connect to database:', err)
        process.exit(1)
    }
}

start()