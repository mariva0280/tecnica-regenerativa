import { useEffect, useMemo, useState } from 'react'

const pickBestMime = () => {
    if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') return null

    const candidates = [
        { type: 'audio/webm;codecs=opus', ext: 'webm' }, // Chrome/Edge (Android/Desktop)
        { type: 'audio/ogg;codecs=opus', ext: 'ogg' },   // Firefox (Android/Desktop)
        { type: 'audio/mp4', ext: 'm4a' },               // Safari (iOS/macOS 17+)
        { type: 'audio/aac', ext: 'aac' },               // Fallback AAC
        { type: 'audio/wav', ext: 'wav' }                // Huge files, last resort
    ]

    for (const c of candidates) {
        if (MediaRecorder.isTypeSupported?.(c.type)) return c
    }
    return { type: '', ext: 'webm' }
}

const extensionFromMime = (mime = '') => {
    if (mime.includes('webm')) return 'webm'
    if (mime.includes('ogg')) return 'ogg'
    if (mime.includes('mp4')) return 'm4a'
    if (mime.includes('aac')) return 'aac'
    if (mime.includes('wav')) return 'wav'
    return 'webm'
}

const createFileFromBlob = (blob) => {
    if (!blob) return null
    const ext = extensionFromMime(blob.type)
    return new File([blob], `recording-${Date.now()}.${ext}`, { type: blob.type || 'application/octet-stream' })
}

export const useAudioRecorder = ({ onError } = {}) => {
    const [mediaRecorder, setMediaRecorder] = useState(null)
    const [isRecording, setIsRecording] = useState(false)
    const [chunks, setChunks] = useState([])
    const [blob, setBlob] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl)
            if (mediaRecorder?.stream) mediaRecorder.stream.getTracks().forEach(track => track.stop())
        }
    }, [previewUrl, mediaRecorder])

    const reset = () => {
        setChunks([])
        setBlob(null)
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
    }

    const start = async () => {
        try {
            if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
                throw new Error('MediaDevices API no disponible')
            }

            // En móviles se requiere HTTPS (excepto localhost)
            if (typeof window !== 'undefined' && !window.isSecureContext && window.location.hostname !== 'localhost') {
                throw new Error('Necesitas HTTPS para grabar audio en móvil')
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const preferred = pickBestMime() || { type: '', ext: 'webm' }

            const recorder = preferred.type ? new MediaRecorder(stream, { mimeType: preferred.type }) : new MediaRecorder(stream)
            const newChunks = []

            recorder.ondataavailable = event => {
                if (event.data?.size > 0) newChunks.push(event.data)
            }
            recorder.onstop = () => {
                setChunks(newChunks)
                const mime = newChunks[0]?.type || preferred.type || 'audio/webm'
                const completeBlob = new Blob(newChunks, { type: mime })
                setBlob(completeBlob)
                if (previewUrl) URL.revokeObjectURL(previewUrl)
                setPreviewUrl(URL.createObjectURL(completeBlob))
                stream.getTracks().forEach(track => track.stop())
            }

            recorder.start()
            setMediaRecorder(recorder)
            setChunks([])
            setBlob(null)
            if (previewUrl) URL.revokeObjectURL(previewUrl)
            setPreviewUrl(null)
            setIsRecording(true)
        } catch (error) {
            console.error(error)
            if (onError) {
                const message = /HTTPS/i.test(error.message)
                    ? 'Para grabar desde el móvil necesitas abrir la app con HTTPS. Como alternativa, usa “Seleccionar audio”.'
                    : 'No se pudo acceder al micrófono. Puedes usar “Seleccionar audio”.'
                onError(message)
            }
        }
    }

    const stop = () => {
        if (!mediaRecorder) return
        mediaRecorder.stop()
        setIsRecording(false)
    }

    const file = useMemo(() => createFileFromBlob(blob), [blob])

    return {
        start,
        stop,
        reset,
        isRecording,
        blob,
        previewUrl,
        file
    }
}

