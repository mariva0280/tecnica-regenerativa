import { useEffect, useState } from 'react'
import { logic } from '../../logic'
import { useContext } from '../../context'

const resolveUrl = rawUrl => {
    if (!rawUrl) return null
    if (/^https?:\/\//i.test(rawUrl)) return rawUrl

    const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '')
    const relative = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`

    return base ? `${base}${relative}` : relative
}

const STATUS_FILTERS = [
    { value: 'all', label: 'Todas' },
    { value: 'pending', label: 'Sin responder' },
    { value: 'answered', label: 'Respondidas' }
]

export const QuestionsList = ({ refreshToken = 0 }) => {
    const { alert } = useContext()

    const [questions, setQuestions] = useState([])
    const [zone, setZone] = useState('')
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [statusFilter, setStatusFilter] = useState('all')

    useEffect(() => {
        let cancelled = false
        setLoading(true)

        logic.getQuestions({ zone, search, page, limit: 10 })
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
    }, [zone, search, page, refreshToken])

    const renderQuestionAudio = question => {
        const attachments = Array.isArray(question.attachments) ? question.attachments : []
        const audioAttachment = attachments.find(att => att?.type === 'audio' && (att.audio?.url || att.url))
        return resolveUrl(audioAttachment?.audio?.url || audioAttachment?.url)
    }

    const renderAnswerAudio = answer => resolveUrl(answer?.audio?.url)

    const filteredQuestions = questions.filter(question => {
        if (statusFilter === 'all') return true
        const hasAnswers = Array.isArray(question.answers) && question.answers.length > 0
        return statusFilter === 'answered' ? hasAnswers : !hasAnswers
    })

    return (
        <div className="p-5 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-3">Preguntas de alumnos</h2>

            <div className="flex flex-wrap gap-2 mb-4">
                {STATUS_FILTERS.map(({ value, label }) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => { setStatusFilter(value); setPage(1) }}
                        className={`rounded-xl px-3 py-1 text-sm font-medium transition-colors ${statusFilter === value ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="flex gap-2 mb-4">
                <input
                    className="border rounded px-3 py-1"
                    placeholder="Filtrar por zona"
                    value={zone}
                    onChange={event => { setZone(event.target.value); setPage(1) }}
                />
                <input
                    className="border rounded px-3 py-1 flex-1"
                    placeholder="Buscar palabra clave..."
                    value={search}
                    onChange={event => { setSearch(event.target.value); setPage(1) }}
                />
            </div>
            {loading && <div>Cargando…</div>}

            <div className="space-y-4">
                {filteredQuestions.map(question => {
                    const questionAudio = renderQuestionAudio(question)
                    const answers = Array.isArray(question.answers) ? question.answers : []
                    const hasAnswers = answers.length > 0

                    return (
                        <div
                            key={question.id}
                            className={`border rounded-lg p-3 shadow-sm ${hasAnswers ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-medium">{question.title}</h3>
                                    {question.zone && <p className="text-xs text-gray-500">Zona: {question.zone}</p>}
                                </div>
                                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${hasAnswers ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}>
                                    {hasAnswers ? 'Respondida' : 'Pendiente'}
                                </span>
                            </div>

                            <p className="mt-1 whitespace-pre-line">{question.body}</p>
                            {questionAudio && (
                                <audio controls src={questionAudio} className="mt-2 w-full" />
                            )}

                            {hasAnswers && (
                                <div className="mt-2 border-t pt-2 space-y-2">
                                    <p className="text-sm font-semibold">Respuestas:</p>
                                    {answers.map((answer, index) => {
                                        const answerAudio = renderAnswerAudio(answer)
                                        const key = answer.id || `${question.id}-answer-${index}`
                                        return (
                                            <div key={key} className="ml-2 text-sm">
                                                {answer.text ? (
                                                    <p>{answer.text}</p>
                                                ) : (
                                                    <p className="italic text-gray-500">(Respuesta sin texto)</p>
                                                )}
                                                {answerAudio && (
                                                    <audio controls src={answerAudio} className="mt-1 w-full" />
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}
                {filteredQuestions.length === 0 && !loading && (
                    <div className="text-gray-500">No hay preguntas con los filtros seleccionados</div>
                )}
            </div>

            {filteredQuestions.length > 0 && (
                <div className="mt-4 flex items-center gap-2">
                    <button
                        className="border rounded px-3 py-1"
                        onClick={() => setPage(previous => Math.max(1, previous - 1))}
                        disabled={page === 1}
                    >
                        Anterior
                    </button>
                    <span>Página {page}</span>
                    <button
                        className="border rounded px-3 py-1"
                        onClick={() => setPage(previous => previous + 1)}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    )
}
