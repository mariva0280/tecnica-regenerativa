import { useNavigate } from 'react-router'

export const AdminPanel = () => {
    const navigate = useNavigate()

    return (
    <div className="p-5">
        <h1 className="text-xl font-bold mb-4">Panel de Administrador</h1>

        <div className="flex flex-col gap-4">
            <button className="bg-black text-white px-4 py-2" onClick={() => navigate('/create-auth-student')}>Autorizar alumno</button>

                <button className="bg-black text-white px-4 py-2" onClick={() => navigate('/create-video')}>Añadir video</button>
            
        </div>
        
    </div>
    )
}
