import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { pool } from '../index'

async function migrate(): Promise<void> {
  const migrationsDir = path.join(__dirname)
  const files = fs
    .readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort()

  if (files.length === 0) {
    console.log('[migrate] No SQL files found in', migrationsDir)
    await pool.end()
    return
  }

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
    console.log(`[migrate] Running ${file}...`)
    await pool.query(sql)
    console.log(`[migrate] ${file} done`)
  }

  console.log('[migrate] All migrations complete')
  await pool.end()
}

migrate().catch(err => {
  console.error('[migrate] Error:', err)
  process.exit(1)
})