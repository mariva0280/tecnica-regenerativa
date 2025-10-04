import { useEffect, useState } from 'react'
import { logic } from '../../logic'
import { useContext } from '../../context'
import { uploadAudio } from '../../logic/uploadAudio'

const ENABLE_AUDIO_UPLOAD = true

const getQuestionAudio = question => {
    const attachments = Array.isArray(question?.attachments) ? question.attachments : []
    const audioAttachment = attachments.find(item => item?.type === 'audio' && item.audio?.url)
    return audioAttachment?.audio?.url || null
}

export const AdminQuestions = () => {
    const { alert } = useContext()

    const [questions, setQuestions] = useState([])
    const [zone, setZone] = useState('')
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState(null)
    const [answerText, setAnswerText] = useState('')
    const [audioFile, setAudioFile] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [refreshToken, setRefreshToken] = useState(0)

    useEffect(() => {
        let cancelled = false
        setLoading(true)

        logic.getQuestions({ zone, search, hasAnswer: false, limit: 20 })
            .then(result => {
                if (!cancelled) setQuestions(result || [])
            })
            .catch(error => {
                if (!cancelled) alert(error.message)
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        return () => { cancelled = true }
    }, [zone, search, refreshToken])

    const handleSelectQuestion = question => {
        setSelected(question)
        setAnswerText('')
        setAudioFile(null)
    }

    const handleSubmitAnswer = event => {
        event.preventDefault()
        if (!selected || submitting) return

        const trimmedText = answerText.trim()
        if (!trimmedText && !audioFile) {
            alert('Escribe una respuesta o adjunta un audio')
            return
        }

        setSubmitting(true)

        let audioPromise = Promise.resolve(null)
        if (ENABLE_AUDIO_UPLOAD && audioFile) {
            audioPromise = uploadAudio(audioFile)
        }

        audioPromise
            .then(audioUrl => logic.answerQuestion(selected.id, trimmedText, audioUrl))
            .then(() => {
                alert('Respuesta registrada')
                setQuestions(prev => prev.filter(q => q.id !== selected.id))
                setRefreshToken(token => token + 1)
                setSelected(null)
            })
            .catch(error => alert(error.message))
            .finally(() => {
                setSubmitting(false)
            })
    }

    const renderQuestionCard = question => {
        const audioUrl = getQuestionAudio(question)
        return (
            <div key={question.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-semibold">{question.title || 'Sin título'}</h3>
                        {question.zone && <p className="text-xs text-gray-500">Zona: {question.zone}</p>}
                    </div>
                    <button
                        className="rounded-xl bg-green-500 px-3 py-1 text-sm font-medium text-white hover:bg-green-600"
                        type="button"
                        onClick={() => handleSelectQuestion(question)}
                    >
                        Responder
                    </button>
                </div>
                {question.body && (
                    <p className="mt-2 whitespace-pre-line text-sm text-gray-700">{question.body}</p>
                )}
                {audioUrl && (
                    <audio controls src={audioUrl} className="mt-3 w-full" />
                )}
                <p className="mt-2 text-xs text-gray-400">
                    Creada {new Date(question.createdAt).toLocaleString()}
                </p>
            </div>
        )
    }

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6">
            <header>
                <h1 className="text-2xl font-semibold">Preguntas pendientes de respuesta</h1>
                <p className="text-sm text-gray-600">Filtra por zona o palabra clave para localizar la pregunta del alumno y registra tu respuesta.</p>
            </header>

            <section className="flex flex-wrap gap-2">
                <input
                    className="flex-1 min-w-[200px] rounded-xl border px-3 py-2"
                    placeholder="Zona"
                    value={zone}
                    onChange={event => setZone(event.target.value)}
                />
                <input
                    className="flex-1 min-w-[200px] rounded-xl border px-3 py-2"
                    placeholder="Buscar palabra clave"
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                />
            </section>

            {loading && <div className="text-sm text-gray-500">Cargando preguntas...</div>}

            {!loading && questions.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
                    No hay preguntas pendientes ahora mismo.
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {questions.map(renderQuestionCard)}
            </div>

            {selected && (
                <section className="rounded-2xl border border-green-200 bg-white p-5 shadow-md">
                    <header className="mb-4">
                        <h2 className="text-xl font-semibold">Responder pregunta seleccionada</h2>
                        <p className="text-sm text-gray-600">{selected.title}</p>
                    </header>

                    <form className="space-y-4" onSubmit={handleSubmitAnswer}>
                        <textarea
                            className="w-full rounded-xl border px-3 py-2"
                            placeholder="Escribe tu respuesta"
                            rows={5}
                            value={answerText}
                            onChange={event => setAnswerText(event.target.value)}
                        />

                        {ENABLE_AUDIO_UPLOAD && (
                            <div className="flex flex-col gap-2 text-sm">
                                <label className="font-medium" htmlFor="answer-audio">Adjuntar audio (opcional)</label>
                                <input
                                    id="answer-audio"
                                    type="file"
                                    accept="audio/*"
                                    onChange={event => setAudioFile(event.target.files[0] || null)}
                                />
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="rounded-xl bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-60"
                            >
                                {submitting ? 'Guardando...' : 'Enviar respuesta'}
                            </button>
                            <button
                                type="button"
                                className="rounded-xl border border-gray-300 px-4 py-2 font-medium text-gray-600 hover:bg-gray-50"
                                onClick={() => setSelected(null)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </section>
            )}
        </div>
    )
}
