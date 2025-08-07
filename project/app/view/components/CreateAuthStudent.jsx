import { useContext } from '../../context'
import { logic } from '../../logic'

export const CreateAuthStudent = ({ onCancelCliked, onAuthStudentCreated }) => {
    const { alert } = useContext()

    const handleAuthStudentSubmit = event => {
        event.preventDefault()

        const form = event.target
        const email = form.email.value

        try {
            logic.registerAuthStudent(email)
                .then(() => {
                    form.reset()

                    alert('Authorized student successfully')
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
        <div className='="p-5'>
            <h1 className="text-xl font-bold mb-4">Autorizar nuevo alumno</h1>

            <form className="flex flex-col gap-4" onSubmit={handleAuthStudentSubmit}>
                <div className="flex flex-col gap">
                    <label htmlFor="email">Email del alumno</label>
                    <input
                        className="border-2 px-2 py-1"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="ejemplo@correo.com"
                        required
                    />    
                </div>

                <div className="flex gap-2">
                    <button className="bg-black text-white px-4 py-2" type="submit">Autorizar</button>

                    <button className="bg-gray-400 text-black px-4 py-2" type="button" onClick={onCancelCliked}>Cancelar</button>
                </div>
            </form>
        </div>
    )
}