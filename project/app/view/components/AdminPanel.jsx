import { useNavigate } from 'react-router'
import { canManageWhiteList, canCreateVideos, canManageUsers } from '../../logic/isUserRole'

export const AdminPanel = () => {
    const navigate = useNavigate()

    return (
    <div className="p-5">
        <h1 className="text-xl font-bold mb-4">Panel de Administrador</h1>

        <div className="flex flex-col gap-4">
            {canManageWhiteList() && (
                <button className="bg-black text-white px-4 py-2" onClick={() => navigate('/create-auth-student')}>Autorizar alumno</button>
            )}

            {canCreateVideos() && (
                <button className="bg-black text-white px-4 py-2" onClick={() => navigate('/create-video')}>Añadir video</button>
            )}

                {canCreateVideos() && (
                    <button className="bg-black text-white px-4 py-2" onClick={() => navigate('/admin-videos')}>Listado de videos</button>
                )}
            
            {canManageUsers() && (
                <button className="bg-black text-white px-4 py-2" onClick={() => navigate('/users-list')}>Listado de usuarios</button>
            )}

            
        </div>
        
    </div>
    )
}
