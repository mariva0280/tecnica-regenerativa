import { useContext } from '../../context'
import { logic } from '../../logic'

export const CreateAuthStudent = ({ onCancelClicked, onAuthStudentCreated }) => {
    const { alert } = useContext()

    const handleAuthStudentSubmit = event => {
        event.preventDefault()

        const form = event.target
        const email = form.email.value

        try {
            logic.registerAuthStudent(email)
                .then(() => {
                    form.reset()

                    alert('Authorized student successfully', 'success')
                    onAuthStudentCreated()
                })
                .catch(error => {
                    console.error(error)

                    alert(error.message)
                })
        } catch (error) {
            console.error(error)

            alert(error.message)
        }
    }

    return (
        <div className="max-w-xl mx-auto rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <h1 className="text-xl font-semibold mb-4">Autorizar nuevo alumno</h1>

            <form className="flex flex-col gap-4" onSubmit={handleAuthStudentSubmit}>
                <div className="flex flex-col gap-1">
                    <label htmlFor="email">Email del alumno</label>
                    <input
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-green-400"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="ejemplo@correo.com"
                        required
                    />    
                </div>

                <div className="flex gap-2">
                    <button className="inline-flex items-center justify-center rounded-2xl px-4 py-2 font-medium bg-green-400 text-white transition-all duration-200 hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-400 active:scale-[0.98]" type="submit">Autorizar</button>

                    <button className="inline-flex items-center justify-center rounded-2xl px-4 py-2 font-medium bg-gray-200 text-slate-900 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-300 active:scale-[0.98]" type="button" onClick={onCancelClicked}>Cancelar</button>
                </div>
            </form>
        </div>
    )
}