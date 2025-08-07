import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router'

import { logic } from '../logic'
import { useContext } from '../context'

import { AdminPanel } from './components/AdminPanel'
import { CreateAuthStudent } from './components/CreateAuthStudent'

export const Home = ({ onUserLoggedOut }) => {
    const navigate = useNavigate()

    const { alert } = useContext()

    const [username, setUsername] = useState('World')

    useEffect(() => {
        try {
            logic.getUserUsername()
                .then(username => {
                    setUsername(username)

                    if (logic.isUserAdministrator())
                        navigate('/admin-panel')
                })
                .catch (error => {
                    console.error(error)

                    alert(error.message)
                })
        } catch (error) {
            console.error(error)

            alert(error.message)
        }
    }, [])

    const handleLogoutClick = () => {
        try {
            logic.logoutUser()

            onUserLoggedOut()
        } catch (error) {
            alert(error.message)
        }
    }

    //const handleCreateAuthStudentClick = () => navigate('/admin-panel')

    const handleCreateAuthStudentCancelClicked = () => navigate('/admin-panel')

    const handleAuthStudentCreated = () => navigate('/admin-panel')

    console.log('Home -> render')

    return <div className="p-5">
        <i className="text-2xl">Logo</i>

        <div className="mt-2">
            <h1 className="text-xl">Hello, {username}!</h1>

            <button
                className="bg-black text-white px-2 mx-1"
                type="button"
                onClick={handleLogoutClick}
            >Logout</button>
        </div>

        <Routes>
            <Route path="/admin-panel" element={<AdminPanel />} />

            <Route path="/create-auth-student" element={<CreateAuthStudent
                onCancelClicked={handleCreateAuthStudentCancelClicked}
                onAuthStudentCreated={handleAuthStudentCreated}
            />} />
        </Routes>
    </div>
}
