import { useEffect, useMemo, useState } from 'react'

const createFileFromBlob = (blob, extension = 'webm') => {
    if (!blob) return null
    return new File([blob], `recording-${Date.now()}.${extension}`, { type: blob.type })
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
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const recorder = new MediaRecorder(stream)
            const newChunks = []
            recorder.ondataavailable = event => {
                if (event.data?.size > 0) newChunks.push(event.data)
            }
            recorder.onstop = () => {
                setChunks(newChunks)
                const completeBlob = new Blob(newChunks, { type: newChunks[0]?.type || 'audio/webm' })
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
            if (onError) onError('No se pudo acceder al micrófono')
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
