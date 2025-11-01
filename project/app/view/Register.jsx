import { logic } from '../logic'

import { useContext } from '../context'

export const Register = ({ onLoginClicked, onUserRegistered }) => {
    const { alert } = useContext()

    const handleLoginClick = () => onLoginClicked()

    const handleRegisterSubmit = event => {
        event.preventDefault()

        const form = event.target

        const name = form.name.value
        const email = form.email.value
        const username = form.username.value
        const password = form.password.value
        const code = form.code.value

        try {
            logic.registerUser(name, email, username, password, code)
                .then(() => {
                    form.reset()

                    onUserRegistered()
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

    console.log('Register -> render')

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-5">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
                <i className="text-2xl font-bold text-green-600">Logo</i>

                <div className="mt-4">
                    <h1 className="text-2xl font-semibold text-black-600 mb-4 text-center">Register</h1>

                    <form className="flex flex-col gap-4" onSubmit={handleRegisterSubmit}>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-black/80" htmlFor="name">Name</label>
                            <input className="rounded-xl border border-black/10 bg-white px-3 py-2 placeholder:text-black/40
                            focus:outline-none focus:ring-2 focus:ring-green-300" type="text" id="name" name="name" placeholder="your full name" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-black/80" htmlFor="email">E-mail</label>
                            <input className="rounded-xl border border-black/10 bg-white px-3 py-2 placeholder:text-black/40
                            focus:outline-none focus:ring-2 focus:ring-green-300" type="email" id="email" name="email" placeholder="your e-mail" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-black/80" htmlFor="username">Username</label>
                            <input className="rounded-xl border border-black/10 bg-white px-3 py-2 placeholder:text-black/40
                            focus:outline-none focus:ring-2 focus:ring-green-300" type="text" id="username" name="username" placeholder="your username" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-black/80" htmlFor="password">Password</label>
                            <input className="rounded-xl border border-black/10 bg-white px-3 py-2 placeholder:text-black/40
                            focus:outline-none focus:ring-2 focus:ring-green-300" type="password" id="password" name="password" placeholder="your password" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-black/80" htmlFor="code">Code</label>
                            <input className="rounded-xl border border-black/10 bg-white px-3 py-2 placeholder:text-black/40
                            focus:outline-none focus:ring-2 focus:ring-green-300" type="password" id="code" name="code" placeholder="your auth code" />
                        </div>

                        <div className="flex items-center justify-between">
                            <a className="text-green-600 hover:underline" href="#" onClick={handleLoginClick}>Login</a>

                            <button className="inline-flex items-center justify-center rounded-2xl px-4 py-2 font-medium
                            bg-green-500 text-white transition-all duration-200
                            hover:bg-green-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-300
                            active:scale-[0.98]" type="submit">Register</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}