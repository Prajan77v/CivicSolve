import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

// Handle Vercel serverless environment with SQLite
if (process.env.VERCEL) {
  try {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const tmpDbPath = '/tmp/dev.db'
    if (fs.existsSync(dbPath) && !fs.existsSync(tmpDbPath)) {
      fs.copyFileSync(dbPath, tmpDbPath)
    }
    if (fs.existsSync(tmpDbPath)) {
      process.env.DATABASE_URL = 'file:/tmp/dev.db'
    }
  } catch (e) {
    console.error('Vercel SQLite setup notice:', e)
  }
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
