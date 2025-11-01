import { useState, useRef } from 'react'
import { logic } from '../../logic'
import { useContext } from '../../context'
import { uploadAudio } from '../../logic/uploadAudio'

export const AdminQuestionsMigration = () => {
    const { alert } = useContext()

    const [zone, setZone] = useState('')
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [questionAudioFile, setQuestionAudioFile] = useState(null)
    const [answerText, setAnswerText] = useState('')
    const [answerAudioFile, setAnswerAudioFile] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const questionAudioInputRef = useRef(null)
    const answerAudioInputRef = useRef(null)

    const resetForm = () => {
        setZone('')
        setTitle('')
        setBody('')
        setQuestionAudioFile(null)
        setAnswerText('')
        setAnswerAudioFile(null)
        if (questionAudioInputRef.current) questionAudioInputRef.current.value = ''
        if (answerAudioInputRef.current) answerAudioInputRef.current.value = ''
    }

    const handleSubmit = event => {
        event.preventDefault()
        if (submitting) return

        const trimmedZone = zone.trim().toLowerCase()
        const trimmedTitle = title.trim()
        const trimmedBody = body.trim()
        const trimmedAnswer = answerText.trim()

        if (!trimmedZone) return alert('Indica la zona de la pregunta')
        if (!trimmedTitle) return alert('Escribe un título para la pregunta')
        if (!trimmedBody) return alert('Describe la pregunta con algo de detalle')
        if (!trimmedAnswer && !answerAudioFile) return alert('Escribe la respuesta o adjunta un audio')

        setSubmitting(true)

        const questionAudioPromise = questionAudioFile ? uploadAudio(questionAudioFile) : Promise.resolve(null)
        const answerAudioPromise = answerAudioFile ? uploadAudio(answerAudioFile) : Promise.resolve(null)

        Promise.all([questionAudioPromise, answerAudioPromise])
            .then(([questionAudioUrl, answerAudioUrl]) =>
                logic.createQuestion(trimmedZone, trimmedTitle, trimmedBody, questionAudioUrl)
                    .then(questionId => logic.answerQuestion(questionId, trimmedAnswer, answerAudioUrl))
            )
            .then(() => {
                alert('Pregunta migrada correctamente', 'success')
                resetForm()
            })
            .catch(error => alert(error.message))
            .finally(() => setSubmitting(false))
    }

    return (
        <div className="mx-auto w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold mb-4">Migrar pregunta respondida</h1>
            <p className="text-sm text-gray-600 mb-6">
                Registra preguntas que ya tienen respuesta en otras plataformas. Puedes añadir audios opcionales para la pregunta y/o la respuesta.
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                    className="w-full rounded-xl border px-3 py-2"
                    placeholder="Zona (ej. manos, rodilla...)"
                    value={zone}
                    onChange={event => setZone(event.target.value)}
                />

                <input
                    className="w-full rounded-xl border px-3 py-2"
                    placeholder="Título de la pregunta"
                    value={title}
                    onChange={event => setTitle(event.target.value)}
                />

                <textarea
                    className="w-full rounded-xl border px-3 py-2"
                    placeholder="Texto de la pregunta"
                    rows={4}
                    value={body}
                    onChange={event => setBody(event.target.value)}
                />

                <div className="flex flex-col gap-2 text-sm">
                    <span className="font-medium">Audio de la pregunta (opcional)</span>
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:-translate-y-0.5 hover:shadow-sm"
                            onClick={() => questionAudioInputRef.current?.click()}
                        >
                            📎 Seleccionar audio
                        </button>
                        <span className="text-xs text-gray-500">
                            {questionAudioFile ? questionAudioFile.name : 'mp3, wav, ogg...'}
                        </span>
                    </div>
                    <input
                        ref={questionAudioInputRef}
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={event => setQuestionAudioFile(event.target.files?.[0] || null)}
                    />
                </div>

                <textarea
                    className="w-full rounded-xl border px-3 py-2"
                    placeholder="Texto de la respuesta"
                    rows={4}
                    value={answerText}
                    onChange={event => setAnswerText(event.target.value)}
                />

                <div className="flex flex-col gap-2 text-sm">
                    <span className="font-medium">Audio de la respuesta (opcional)</span>
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:-translate-y-0.5 hover:shadow-sm"
                            onClick={() => answerAudioInputRef.current?.click()}
                        >
                            📎 Seleccionar audio
                        </button>
                        <span className="text-xs text-gray-500">
                            {answerAudioFile ? answerAudioFile.name : 'mp3, wav, ogg...'}
                        </span>
                    </div>
                    <input
                        ref={answerAudioInputRef}
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={event => setAnswerAudioFile(event.target.files?.[0] || null)}
                    />
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        type="button"
                        className="rounded-xl border border-gray-300 px-4 py-2 font-medium text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:-translate-y-0.5 hover:shadow-sm"
                        onClick={resetForm}
                        disabled={submitting}
                    >
                        Limpiar
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-xl bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-60"
                    >
                        {submitting ? 'Guardando...' : 'Migrar pregunta'}
                    </button>
                </div>
            </form>
        </div>
    )
}
