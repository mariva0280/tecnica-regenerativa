import { Component } from 'react'

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, info) {
        if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('ErrorBoundary:', error, info)
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="mx-auto my-6 max-w-xl rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                    <h2 className="text-lg font-semibold mb-1">Ha ocurrido un error</h2>
                    <p className="text-sm">Intenta recargar la página o volver atrás.</p>
                </div>
            )
        }

        return this.props.children
    }
}

