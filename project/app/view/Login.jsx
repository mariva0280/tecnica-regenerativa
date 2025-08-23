import { CredentialsError, NotFoundError, SystemError, ValidationError } from 'com'

import { logic } from '../logic'

import { useContext } from '../context'

export const Login = ({ onRegisterClicked, onUserLoggedIn }) => {
    const { alert } = useContext()

    const handleRegisterClick = () => onRegisterClicked()

    const handleLoginSubmit = event => {
        event.preventDefault()

        const form = event.target

        const username = form.username.value
        const password = form.password.value

        try {
            logic.loginUser(username, password)
                .then(() => {
                    form.reset()

                    onUserLoggedIn()
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


    console.log('Login -> render')

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-5">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
                <i className="text-2xl font-bold text-green-600">Logo</i>

                <div className="mt-4">
                    <h1 className="text-2xl font-semibold text-black-600 mb-4 text-center">Login</h1>

                    <form className="flex flex-col gap-4" onSubmit={handleLoginSubmit}>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="username" className="text-sm font-medium text-black/80" >Username</label>
                            <input className="rounded-xl border border-black/10 bg-white px-3 py-2 placeholder:text-black/40
                            focus:outline-none focus:ring-2 focus:ring-green-300" type="text" id="username" name="username" placeholder="your username" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="password" className="text-sm font-medium text-black/80">password</label>
                            <input className="rounded-xl border border-black/10 bg-white px-3 py-2 placeholder:text-black/40
                            focus:outline-none focus:ring-2 focus:ring-green-300" type="password" id="password" name="password" placeholder="your password" />
                        </div>

                        <div className="flex items-center justify-between">
                            <a className="text-green-600 hover:underline" href="#" onClick={handleRegisterClick}>Register</a>

                            <button className="inline-flex items-center justify-center rounded-2xl px-4 py-2 font-medium
                            bg-green-500 text-white transition-all duration-200
                            hover:bg-green-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-300
                            active:scale-[0.98]" type="submit">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}