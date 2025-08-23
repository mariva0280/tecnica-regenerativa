import { useNavigate } from 'react-router'
import { canManageWhiteList, canCreateVideos, canManageUsers } from '../../logic/isUserRole'

export const AdminPanel = () => {
    const navigate = useNavigate()

    return (
        <div className="mx-auto w-full max-w-3xl rounded-2xl border border-black/10 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
            <h1 className="text-2xl font-semibold tracking-tight mb-1">Panel de administración</h1>
            <p className="text-sm text-slate-600 mb-5">Acciones rápidas</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {canManageWhiteList() && (
                    <button
                        onClick={() => navigate('/create-auth-student')}
                        className="inline-flex items-center justify-center rounded-2xl px-4 py-3 font-medium bg-green-400 text-white transition-all duration-200 hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-400 active:scale-[0.98]"
                    >
                        Autorizar alumno
                    </button>
                )}

                {canCreateVideos() && (
                    <button
                        onClick={() => navigate('/create-video')}
                        className="inline-flex items-center justify-center rounded-2xl px-4 py-3 font-medium bg-green-400 text-white transition-all duration-200 hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-400 active:scale-[0.98]"
                    >
                        Añadir vídeo
                    </button>
                )}

                {canCreateVideos() && (
                    <button
                        onClick={() => navigate('/admin-videos')}
                        className="inline-flex items-center justify-center rounded-2xl px-4 py-3 font-medium bg-green-400 text-white transition-all duration-200 hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-400 active:scale-[0.98]"
                    >
                        Listado de vídeos
                    </button>
                )}

                {canManageUsers() && (
                    <button
                        onClick={() => navigate('/users-list')}
                        className="inline-flex items-center justify-center rounded-2xl px-4 py-3 font-medium bg-green-400 text-white transition-all duration-200 hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-400 active:scale-[0.98]"
                    >
                        Listado de usuarios
                    </button>
                )}
            </div>
        </div>
    )
}
