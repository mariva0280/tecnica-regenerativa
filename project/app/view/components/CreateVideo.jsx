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

                    alert('Video created')
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

        (
            <div className="p-5">
                <h1 className="text-xl font-bold mb-4">Crear vídeo</h1>

                <form className="flex flex-col gap-4" onSubmit={handleCreateVideoSubmit}>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="title">Título</label>
                        <input id="title" name="title" className="border px-2 py-1" placeholder="Título del vídeo" required />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="description">Descripción</label>
                        <textarea id="description" name="description" className="border px-2 py-1" placeholder="Breve descripción" rows={3} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="zone">Zona</label>
                        <input id="zone" name="zone" className="border px-2 py-1" placeholder="manos / rodilla / hombro..." required />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="vimeoId">Vimeo ID</label>
                        <input id="vimeoId" name="vimeoId" className="border px-2 py-1" placeholder="p.ej. 1108367466" required />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="vimeoHash">Vimeo hash (opcional)</label>
                        <input id="vimeoHash" name="vimeoHash" className="border px-2 py-1" placeholder="Si usas privacidad por hash" />
                    </div>

                    <label className="inline-flex items-center gap-2">
                        <input type="checkbox" id="isPublished" name="isPublished" />
                        <span>Publicar ahora</span>
                    </label>

                    <div className="flex gap-2">
                        <button className="bg-black text-white px-4 py-2" type="submit">Crear</button>
                        <button className="bg-gray-300 text-black px-4 py-2" type="button" onClick={onCancelClicked}>Cancelar</button>
                    </div>
                </form>
            </div>
        )
}
