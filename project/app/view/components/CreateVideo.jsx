import { useContext } from '../../context';
import { logic } from '../../logic'

export const CreateVideo = ({ onCancelClicked, onVideoCreated }) => {
    const { alert } = useContext()

    const handleCreateVideoSubmit = (event) => {
        event.preventDefault()
        const form = event.target

        const title = form.title.value 
        const description = form.description.value 
        const zone = form.zone.value 
        const vimeoId = form.vimeoId.value 
        const vimeoHash = (form.vimeoHash.value || '').trim() || undefined
        const isPublished = form.isPublished.checked 

        try {
            logic.createVideo(title, description, zone, vimeoId, vimeoHash, isPublished)
                .then(() => {
                    form.reset()

                    alert('Video created', 'success')
                    onVideoCreated()
                })
                .catch(error => {
                    console.error (error)

                    alert(error.message)
                })
        } catch(error) {
            console.error(error)

            alert(error.message)
        }
    }

    console.log('CreateVideo -> render')

    return (
        <div className="mx-auto w-full max-w-2xl rounded-2xl border border-black/10 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
            <h1 className="text-2xl font-semibold tracking-tight mb-1">Crear vídeo</h1>
            <p className="text-sm text-slate-600 mb-5">Sube la información del vídeo de Vimeo y publícalo cuando quieras.</p>

            <form className="flex flex-col gap-4" onSubmit={handleCreateVideoSubmit}>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-800" htmlFor="title">Título</label>
                    <input
                        id="title" name="title"
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                        placeholder="Título del vídeo"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-800" htmlFor="description">Descripción</label>
                    <textarea
                        id="description" name="description" rows={3}
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                        placeholder="Breve descripción"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-slate-800" htmlFor="zone">Zona</label>
                        <input
                            id="zone" name="zone"
                            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                            placeholder="manos / rodilla / hombro..."
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-slate-800" htmlFor="vimeoId">Vimeo ID</label>
                        <input
                            id="vimeoId" name="vimeoId"
                            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                            placeholder="p.ej. 1108367466"
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-800" htmlFor="vimeoHash">Vimeo hash (opcional)</label>
                    <input
                        id="vimeoHash" name="vimeoHash"
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                        placeholder="Si usas privacidad por hash"
                    />
                </div>

                <label className="inline-flex items-center gap-2">
                    <input
                        type="checkbox" id="isPublished" name="isPublished"
                        className="h-4 w-4 rounded-md border-black/20 text-orange-600 focus:ring-orange-300"
                    />
                    <span className="text-sm text-slate-800">Publicar ahora</span>
                </label>

                <div className="flex flex-wrap gap-2 pt-1">
                    <button
                        className="inline-flex items-center justify-center rounded-2xl px-4 py-2 font-medium bg-green-400 text-white transition-all duration-200 hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-400 active:scale-[0.98]"
                        type="submit"
                    >
                        Crear
                    </button>
                    <button
                        className="inline-flex items-center justify-center rounded-2xl px-4 py-2 font-medium bg-gray-200 text-slate-900 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-300 active:scale-[0.98]"
                        type="button"
                        onClick={onCancelClicked}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
        )
}
