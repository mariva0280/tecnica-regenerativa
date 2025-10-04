import { useState } from 'react'
import { AskQuestion } from './AskQuestion'
import { QuestionsList } from './QuestionsList'

export const Questions = () => {
    const [tab, setTab] = useState('browse')
    const [refreshToken, setRefreshToken] = useState(0)

    const handleCreated = () => {
        setTab('browse')
        setRefreshToken(token => token + 1)
    }

    const baseTabClasses = 'px-3 py-2 rounded-t-xl transition-colors'
    const activeTabClasses = 'bg-green-600 text-white shadow'
    const inactiveTabClasses = 'text-green-700 hover:bg-green-50 border border-transparent hover:border-green-200'

    return (
        <div className="p-5 max-w-6xl mx-auto">
            <h1 className="text-xl font-semibold mb-4">Preguntas</h1>

            <nav className="mb-4 flex gap-2 border-b border-green-200">
                <button
                    className={`${baseTabClasses} ${tab === 'browse' ? activeTabClasses : inactiveTabClasses}`}
                    onClick={() => setTab('browse')}
                    type="button"
                >
                    Buscar
                </button>
                <button
                    className={`${baseTabClasses} ${tab === 'ask' ? activeTabClasses : inactiveTabClasses}`}
                    onClick={() => setTab('ask')}
                    type="button"
                >
                    Crear pregunta
                </button>
            </nav>

            {tab === 'browse'
                ? <QuestionsList refreshToken={refreshToken} />
                : <AskQuestion onCreated={handleCreated} />}
        </div>
    )
}
