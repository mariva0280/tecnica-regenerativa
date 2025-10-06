const palette = {
    success: {
        icon: '✅',
        iconClass: 'text-green-500',
        borderClass: 'border-green-200',
        buttonClass: 'bg-green-500 hover:bg-green-600'
    },
    error: {
        icon: '⚠️',
        iconClass: 'text-amber-500',
        borderClass: 'border-amber-200',
        buttonClass: 'bg-amber-500 hover:bg-amber-600'
    }
}

export const Alert = ({ message, onAccepted, variant = 'error' }) => {
    const handleAcceptAlert = () => onAccepted()

    const { icon, iconClass, borderClass, buttonClass } = palette[variant] || palette.error

    return (
        <div className="fixed inset-0 z-50 bg-white/10 backdrop-blur-sm flex items-center justify-center px-4">
            <div className={`bg-white border ${borderClass} rounded-xl shadow-lg w-full max-w-md p-6 flex flex-col items-center gap-4`}>
                <div className={`text-4xl ${iconClass}`}>{icon}</div>
                <p className="text-center text-gray-800 whitespace-pre-line">{message}</p>

                <button
                    className={`${buttonClass} text-white font-medium px-4 py-2 rounded transition-transform transform hover:-translate-y-0.5 hover:shadow-md`}
                    type="button"
                    onClick={handleAcceptAlert}
                >
                    Aceptar
                </button>
            </div>
        </div>
    )
}
