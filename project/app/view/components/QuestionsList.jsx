import { useEffect, useState } from 'react'
import { logic } from '../../logic'
import { useContext } from '../../context'

export const QuestionsList = ({ refreshToken = 0 }) => {
    const { alert } = useContext()

    const [questions, setQuestions] = useState([])
    const [zone, setZone] = useState('')
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)

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

    const renderQuestionAudio = (question) => {
        const attachments = Array.isArray(question.attachments) ? question.attachments : []
        const audioAttachment = attachments.find(att => att?.type === 'audio' && att.audio?.url)
        return audioAttachment?.audio?.url || null
    }

    const renderAnswerAudio = (answer) => answer?.audio?.url || null

    return (
        <div className="p-5 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-3">Preguntas de alumnos</h2>

            <div className="flex gap-2 mb-4">
                <input
                    className="border rounded px-3 py-1"
                    placeholder="Filtrar por zona"
                    value={zone}
                    onChange={e => { setZone(e.target.value); setPage(1) }}
                />
                <input
                    className="border rounded px-3 py-1 flex-1"
                    placeholder="Buscar palabra clave..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1) }}
                />
            </div>
            {loading && <div>Cargando…</div>}

            <div className="space-y-4">
                {questions.map(question => {
                    const questionAudio = renderQuestionAudio(question)
                    const answers = Array.isArray(question.answers) ? question.answers : []

                    return (
                        <div key={question.id} className="border rounded-lg p-3 bg-white shadow-sm">
                            <h3 className="font-medium">{question.title}</h3>
                            {question.zone && <p className="text-xs text-gray-500">Zona: {question.zone}</p>}
                            <p className="mt-1 whitespace-pre-line">{question.body}</p>
                            {questionAudio && (
                                <audio controls src={questionAudio} className="mt-2" />
                            )}

                            {answers.length > 0 && (
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
                                                    <audio controls src={answerAudio} className="mt-1" />
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}
                {questions.length === 0 && !loading && (
                    <div className="text-gray-500">No hay preguntas aún</div>
                )}
            </div>

            {questions.length > 0 && (
                <div className="mt-4 flex items-center gap-2">
                    <button
                        className="border rounded px-3 py-1"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Anterior
                    </button>
                    <span>Página {page}</span>
                    <button
                        className="border rounded px-3 py-1"
                        onClick={() => setPage(p => p + 1)}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    )
}
