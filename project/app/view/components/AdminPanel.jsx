import { useNavigate } from 'react-router'
import { canManageWhiteList, canCreateVideos, canManageUsers, isAdminLike, canMigrateQuestions } from '../../logic/isUserRole'

const ActionButton = ({ onClick, children }) => (
    <button
        onClick={onClick}
        className="inline-flex items-center justify-center rounded-2xl px-4 py-3 font-medium bg-green-400 text-white transition-all duration-200 hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-400 active:scale-[0.98]"
        type="button"
    >
        {children}
    </button>
)

export const AdminPanel = () => {
    const navigate = useNavigate()

    return (
        <div className="mx-auto w-full max-w-3xl rounded-2xl border border-black/10 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
            <h1 className="text-2xl font-semibold tracking-tight mb-1">Panel de administración</h1>
            <p className="text-sm text-slate-600 mb-5">Acciones rápidas</p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {canManageWhiteList() && (
                    <ActionButton onClick={() => navigate('/create-auth-student')}>
                        Autorizar alumno
                    </ActionButton>
                )}

                {canCreateVideos() && (
                    <ActionButton onClick={() => navigate('/create-video')}>
                        Añadir vídeo
                    </ActionButton>
                )}

                {canCreateVideos() && (
                    <ActionButton onClick={() => navigate('/admin-videos')}>
                        Listado de vídeos
                    </ActionButton>
                )}

                {canManageUsers() && (
                    <ActionButton onClick={() => navigate('/users-list')}>
                        Listado de usuarios
                    </ActionButton>
                )}

                {canMigrateQuestions() && (
                    <ActionButton onClick={() => navigate('/admin-questions-migrate')}>
                        Migrar preguntas
                    </ActionButton>
                )}

                {isAdminLike() && (
                    <ActionButton onClick={() => navigate('/admin-questions')}>
                        Responder preguntas
                    </ActionButton>
                )}
            </div>
        </div>
    )
}
