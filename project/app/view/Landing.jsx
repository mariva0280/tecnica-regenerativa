import { useEffect, useRef, useState } from 'react'

export const Landing = ({ onRegisterClicked, onLoginClicked }) => {
    // 👉 Sustituye estas URLs por tus imágenes cuando las tengas
    const slides = [
        'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1550828520-63f2d0b82f19?q=80&w=1200&auto=format&fit=crop'
    ]

    const [index, setIndex] = useState(0)
    const [hover, setHover] = useState(false)
    const timer = useRef(null)

    // Auto‑rotación
    useEffect(() => {
        if (hover) return
        timer.current = setInterval(() => {
            setIndex(i => (i + 1) % slides.length)
        }, 4000)
        return () => clearInterval(timer.current)
    }, [hover, slides.length])

    const goTo = (i) => setIndex((i + slides.length) % slides.length)
    const prev = () => goTo(index - 1)
    const next = () => goTo(index + 1)

    const handleRegisterClick = (e) => { e.preventDefault(); onRegisterClicked() }
    const handleLoginClick = (e) => { e.preventDefault(); onLoginClicked() }

    console.log('Landing -> render')

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-5">
            <div className="w-full max-w-5xl rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden">
                {/* Header simple con logo de placeholder */}
                <div className="flex items-center gap-3 p-5 border-b border-black/10">
                    <div className="h-10 w-10 rounded-xl bg-green-600/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-green-600">TR</span>
                    </div>
                    <span className="text-xl font-bold text-green-700">Técnica Regenerativa</span>
                </div>

                {/* Carrusel */}
                <div
                    className="relative"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    <div className="w-full aspect-[16/9] bg-black">
                        {slides.map((src, i) => (
                            <img
                                key={src}
                                src={src}
                                alt={`slide-${i + 1}`}
                                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'
                                    }`}
                                draggable="false"
                            />
                        ))}
                        {/* Degradado y copy encima */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                        <div className="absolute left-6 right-6 bottom-6 text-white drop-shadow-md">
                            <h1 className="text-2xl md:text-3xl font-semibold">
                                Formación y recursos de técnica regenerativa
                            </h1>
                            <p className="mt-1 text-sm md:text-base text-white/90 max-w-2xl">
                                Vídeos organizados por zonas, respuestas del equipo docente y un espacio para tus preguntas.
                            </p>
                        </div>
                    </div>

                    {/* Controles */}
                    <button
                        type="button"
                        onClick={prev}
                        aria-label="Anterior"
                        className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black shadow hover:bg-white"
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        onClick={next}
                        aria-label="Siguiente"
                        className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black shadow hover:bg-white"
                    >
                        ›
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                aria-label={`Ir al slide ${i + 1}`}
                                className={`h-2.5 rounded-full transition-all ${i === index ? 'w-7 bg-white' : 'w-2.5 bg-white/60 hover:bg-white/80'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="p-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                    <p className="text-black/70">
                        ¿Aún no tienes acceso? Necesitas autorización del administrador.
                    </p>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleRegisterClick}
                            className="inline-flex items-center justify-center rounded-2xl px-5 py-2.5 font-medium bg-green-600 text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-300 active:scale-[0.98]"
                        >
                            Crear cuenta
                        </button>
                        <button
                            type="button"
                            onClick={handleLoginClick}
                            className="inline-flex items-center justify-center rounded-2xl px-5 py-2.5 font-medium border border-black/10 bg-white text-black transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-black/10 active:scale-[0.98]"
                        >
                            Iniciar sesión
                        </button>
                    </div>
                </div>
                {/* Footer */}
                <footer className="mt-6 border-t border-black/10 bg-white">
                    <div className="max-w-5xl mx-auto px-5 py-4 flex flex-col sm:flex-row justify-between items-center text-sm text-black/60">
                        <p>© {new Date().getFullYear()} Técnica Regenerativa. Todos los derechos reservados.</p>
                        <div className="flex gap-4 mt-2 sm:mt-0">
                            <a href="#" className="hover:underline">Aviso legal</a>
                            <a href="#" className="hover:underline">Política de privacidad</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}
