import { Router } from 'express'
import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'
import jwt from 'jsonwebtoken'
import { AuthorizationError } from 'com'

const { JWT_SECRET } = process.env

export const uploadAudioRouter = Router()

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads', { recursive: true })
}

const storage = multer.diskStorage({
    destination: (request, file, cb) => cb(null, 'uploads/'),
    filename: (request, file, cb) => {
        const ext = path.extname(file.originalname) || ''
        const base = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        cb(null, `${base}${ext}`)
    }
})

// Aceptamos formatos de audio comunes (por MIME) y validamos por extensión
const allowedMime = new Set([
    'audio/mpeg',     // .mp3
    'audio/wav',      // .wav
    'audio/ogg',      // .ogg
    'audio/webm',     // .webm
    'audio/x-m4a',    // .m4a
    'audio/mp4',      // .mp4 (contenedor)
    'audio/aac',      // .aac
    'audio/opus',     // .opus (telegram, etc.)
    'application/ogg' // algunos .oga/.ogg
])

const allowedExt = new Set(['.mp3', '.wav', '.ogg', '.oga', '.webm', '.m4a', '.mp4', '.aac', '.opus'])

const fileFilter = (request, file, cb) => {
    const mimetypeOk = allowedMime.has(file.mimetype)
    const ext = (path.extname(file.originalname) || '').toLowerCase()
    const extOk = allowedExt.has(ext)
    if (mimetypeOk || extOk) cb(null, true)
    else cb(new Error('Unsupported audio type'), false)
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 20 * 1024 * 1024 } // 20 MB
})

const authenticateUpload = (request, response, next) => {
    try {
        const authorization = request.headers.authorization
        if (!authorization) throw new AuthorizationError('missing token')

        const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : authorization
        const payload = jwt.verify(token, JWT_SECRET)

        request.auth = { userId: payload.sub, role: payload.role }

        next()
    } catch (error) {
        next(error)
    }
}

uploadAudioRouter.post('/', authenticateUpload, upload.single('audio'), (request, response) => {
    if (!request.file) return response.status(400).json({ error: 'No file uploaded' })

    const url = `/uploads/${request.file.filename}`
    const format = path.extname(request.file.filename).replace('.', '').toLowerCase()

    return response.json({
        url,
        sizeBytes: request.file.size,
        mimetype: request.file.mimetype,
        filename: request.file.filename,
        format: format || 'unknown'
    })
})
