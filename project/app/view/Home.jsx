import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router'

import { logic } from '../logic'

import { AdminPanel } from './components/AdminPanel'
import { useContext } from '../context'

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
                        navigate('/adminPanel')
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

    const handleCreateAuthStudentClick = () => navigate('/create-auth-student')

    const handleCreateAuthStudentCancelClicked = () => navigate('/admin-panel')

    const handleAuthStudentCreated = () => navigate('/auth-students')

    console.log('Home -> render')

    return <div className="p-5">
        <i className="text-2xl">Logo</i>

        <div className="mt-2">
            <h1 className="text-xl">Hello, {username}!</h1>

            <button
                className="bg-black text-white px-2 mx-1"
                type="button"
                onClick={handleCreateAuthStudentClick}
            >+</button>

            <button
                className="bg-black text-white px-2 mx-1"
                type="button"
                onClick={handleLogoutClick}
            >Logout</button>
        </div>

        <Routes>
            <Route path="/auth-students" element={<Posts alert={alert} confirm={confirm} />} />

            <Route path="/create-auth-student" element={<AdminPanel
                onCancelClicked={handleCreateAuthStudentCancelClicked}
                onPostCreated={handleAuthStudentCreated}
            />} />
        </Routes>
    </div>
}
