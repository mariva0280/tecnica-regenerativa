import { useEffect, useState } from 'react'
import { logic } from '../../logic'
import { useContext } from '../../context'

export const Videos = () => {
    const { alert } = useContext()

    const [zoneInput, setZoneInput] = useState('')
    const [zone, setZone] = useState(undefined)
    const [page, setPage] = useState(1)
    const [videos, setVideos] = useState([])
    const [selected, setSelected] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const time = setTimeout(() => {
            const zone = zoneInput.trim().toLowerCase()
            setZone(zone || undefined)
            setPage(1)
        }, 300)
        return () => clearTimeout(time)
    }, [zoneInput])
    
    useEffect(() => {
        setLoading(true)
        try {
            logic.getVideos({ zone, page, limit: 20, onlyPublished: true })
                .then(videos => {
                    setVideos(videos || [])

                    setSelected(prev => {
                        if (prev && videos?.some(v => (v._id && v._id === prev._id) || v.vimeoId === prev.vimeoId)) {
                            return prev
                        }
                        return videos && videos[0] ? videos[0] : null
                    })
                })
                .catch(error => {
                    console.error(error)

                    alert(error.message)
                })
                .finally(() => setLoading(false))
        } catch (error) {
            console.error(error)        
            alert(error.message)
            setLoading(false)
        }
    }, [zone, page])
    
    return (
        <div className="max-w-6xl mx-auto rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <h1 className="text-xl font-semibold mb-3">Vídeos</h1>

            {/* Buscador por zona */}
            <div className="flex gap-2 mb-4">
                <input
                    className="border border-black/10 rounded-xl px-3 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-green-300"
                    placeholder="Filtrar por zona (manos, rodilla, hombro...)"
                    value={zoneInput}
                    onChange={(e) => setZoneInput(e.target.value)}
                />
            </div>

            {loading && <div className="mb-3">Cargando…</div>}

            <div className="grid md:grid-cols-3 gap-6">
                {/* Reproductor y detalle */}
                <div className="md:col-span-2">
                    {selected ? (
                        <>
                            <VimeoPlayer vimeoId={selected.vimeoId} vimeoHash={selected.vimeoHash} />

                            <h2 className="mt-3 text-lg font-semibold">{selected.title}</h2>
                            {selected.zone && <div className="text-xs opacity-70">Zona: {selected.zone}</div>}
                            {selected.description && (
                                <p className="text-sm opacity-80 mt-2 whitespace-pre-line">{selected.description}</p>
                            )}
                        </>
                    ) : (
                        <div className="border rounded-xl p-4 text-center text-black/60">No hay vídeos para mostrar.</div>
                    )}
                </div>

                {/* Lista lateral */}
                <div className="space-y-2">
                    {videos.map(v => {
                        const isActive =
                            (selected && selected._id && v._id && selected._id === v._id) ||
                            (selected && selected.vimeoId === v.vimeoId)

                        return (
                            <button
                                key={v._id || v.vimeoId}
                                className={`w-full text-left border  rounded-xl p-3 hover:bg-green-50 ${isActive ? 'border-green-400' : ''}`}
                                onClick={() => setSelected(v)}
                                title={v.zone}
                            >
                                <div className="font-medium ">{v.title}</div>
                                {v.zone && <div className="text-xs text-black/60">{v.zone}</div>}
                                {v.description && <div className="text-xs text-black/50 truncate">{v.description}</div>}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Paginación básica */}
            {videos.length > 0 && (
                <div className="mt-4 flex items-center gap-2">
                    <button
                        className="border-none rounded-2xl px-2 py-1 bg-indigo-300 hover:bg-indigo-500"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Anterior
                    </button>
                    <span className="text-sm">Página {page}</span>
                    <button
                        className="border-none rounded-2xl px-2 py-1 bg-green-300 hover:bg-green-500"
                        onClick={() => setPage(p => p + 1)}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    )
}

const VimeoPlayer = ({ vimeoId, vimeoHash }) => {
    if (!vimeoId) return <div className="border p-4 rounded">Vídeo no disponible.</div>

    const src = vimeoHash
        ? `https://player.vimeo.com/video/${vimeoId}?h=${vimeoHash}`
        : `https://player.vimeo.com/video/${vimeoId}`

    return (
        <div className="w-full aspect-video">
            <iframe
                src={src}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={`vimeo-${vimeoId}`}
            />
        </div>
    )

}
