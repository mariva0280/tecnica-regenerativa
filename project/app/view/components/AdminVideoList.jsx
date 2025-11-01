import { use, useEffect, useState }  from 'react'
import { logic } from '../../logic'
import { useContext } from '../../context'
import { canCreateVideos, canDeleteVideos } from '../../logic/isUserRole'

export const AdminVideoList = () => {
    const { alert, confirm } = useContext()

    const [zone, setZone] = useState('')
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        logic.getVideos({
            zone: zone.trim() || undefined,
            search: search.trim() || undefined,
            page,
            limit: 20,
            onlyPublished: undefined   
        })
            .then(videos => setVideos(videos || []))
            .catch(error => {
                console.error(error)
                alert(error.message)
            })
            .finally(() => setLoading(false))
    }, [zone, search, page])

    const handleDeleteVideoClick = (videoId, title) => {
        if (!canCreateVideos()) return
        confirm(`Are you sure you want to delete "${title || 'this video'}"?`)
            .then(ok => {
                if (!ok) return
                return logic.deleteVideo(videoId)
                    .then(() => {
                        alert('Video deleted successfully', 'success')
                        setVideos(prev => prev.filter(v => (v._id || v.id) !== videoId))
                    })
                    .catch(error => {
                        console.error(error)
                        alert(error.message)
                    })
            })
        }

    return (
        <div className="max-w-4xl mx-auto rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <h1 className="text-xl font-semibold mb-4">Gestión de vídeos</h1>

            <div className="flex flex-wrap gap-2 mb-4">
                <input
                    className="border px-3 py-2 rounded-xl flex-1"
                    placeholder="Zona (manos, hombro, rodilla...)"
                    value={zone}
                    onChange={(e) => {
                        setZone(e.target.value)
                        setPage(1)
                    }}
                />
                <input
                    className="border px-3 py-2 rounded-xl flex-1"
                    placeholder="Buscar en título/descripción"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value)
                        setPage(1)
                    }}
                />
            </div>

            {loading && <div className="mb-2">Cargando…</div>}

            <div className="overflow-auto border rounded-xl">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-2 text-left">Título</th>
                            <th className="p-2 text-left">Zona</th>
                            <th className="p-2 text-left">Publicado</th>
                            <th className="p-2 text-left">Vimeo</th>
                            <th className="p-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {videos.map((v) => {
                            const id = v._id || v.id
                            return (
                                <tr key={id} className="border-t">
                                    <td className="p-2">{v.title}</td>
                                    <td className="p-2">{v.zone || '-'}</td>
                                    <td className="p-2">{v.isPublished ? 'Sí' : 'No'}</td>
                                    <td className="p-2">{v.vimeoId}</td>
                                    <td className="p-2">
                                        <button
                                            className="inline-flex items-center justify-center rounded-xl px-3 py-1.5 font-medium bg-orange-300 text-white transition-all duration-200 hover:bg-orange-500 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-orange-300 active:scale-[0.98]"
                                            onClick={() => handleDeleteVideoClick(id, v.title)}
                                        >
                                            Borrar 🗑️
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                        {videos.length === 0 && !loading && (
                            <tr>
                                <td
                                    className="p-3 text-center opacity-70"
                                    colSpan={5}
                                >
                                    Sin resultados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {videos.length > 0 && (
                <div className="mt-3 flex items-center gap-2">
                    <button
                        className="rounded-xl px-3 py-1.5 bg-indigo-300 text-white hover:bg-indigo-500 transition"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Anterior
                    </button>
                    <span>Página {page}</span>
                    <button
                        className="rounded-xl px-3 py-1.5 bg-green-400 text-white hover:bg-green-500 transition"
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    )
            
            
}