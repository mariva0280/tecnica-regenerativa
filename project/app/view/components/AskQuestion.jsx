import { useState } from 'react'
import { logic } from '../../logic'
import { useContext } from '../../context'
import { uploadAudio } from '../../logic/uploadAudio'

const ENABLE_AUDIO_UPLOAD = false

export const AskQuestion = ({ onCreated }) => {
    const { alert } = useContext()

    const [zone, setZone] = useState('')
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [audioFile, setAudioFile] = useState(null)
    const [loading, setLoading] = useState(false)

    const resetForm = () => {
        setZone('')
        setTitle('')
        setBody('')
        setAudioFile(null)
    }

    const handleSubmitQuestion = (event) => {
        event.preventDefault()
        if (loading) return

        const trimmedZone = zone.trim()
        const trimmedTitle = title.trim()
        const trimmedBody = body.trim()

        if (!trimmedZone) {
            alert('Indica la zona a la que pertenece tu pregunta')
            return
        }

        if (!trimmedTitle) {
            alert('Escribe un t\u00edtulo para tu pregunta')
            return
        }

        if (!trimmedBody) {
            alert('Describe tu pregunta con un poco de detalle')
            return
        }

        setLoading(true)

        let audioPromise = Promise.resolve(null)

        if (ENABLE_AUDIO_UPLOAD && audioFile) {
            audioPromise = uploadAudio(audioFile)
        }

        audioPromise
            .then(audioUrl => logic.createQuestion(trimmedZone, trimmedTitle, trimmedBody, audioUrl))
            .then(() => {
                alert('Pregunta creada correctamente')
                resetForm()
                if (onCreated) onCreated()
            })
            .catch(error => alert(error.message))
            .finally(() => setLoading(false))
    }

    return (
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Hacer una pregunta</h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmitQuestion}>
                <input
                    className="rounded-xl border px-3 py-2"
                    placeholder="Zona (ej. manos, rodilla, hombro...)"
                    value={zone}
                    onChange={e => setZone(e.target.value)}
                    required
                />
                <input
                    className="rounded-xl border px-3 py-2"
                    placeholder="Título breve"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                />
                <textarea
                    className="rounded-xl border px-3 py-2"
                    placeholder="Describe tu pregunta..."
                    rows={4}
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    required
                />
                {ENABLE_AUDIO_UPLOAD && (
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={e => setAudioFile(e.target.files[0] || null)}
                    />
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white rounded-xl px-4 py-2 hover:bg-green-700 transition disabled:opacity-50"
                >
                    {loading ? 'Enviando...' : 'Enviar'}
                </button>
            </form>
        </div>
    )
}
