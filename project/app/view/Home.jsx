import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, NavLink, Navigate, Link } from 'react-router'

import { logic } from '../logic'
import { useContext } from '../context'

import { AdminPanel } from './components/AdminPanel'
import { CreateAuthStudent } from './components/CreateAuthStudent'
import { UsersList } from './components/UsersList'
import { CreateVideo } from './components/CreateVideo'
import { Videos } from './components/Videos'

import { canSeeStudentArea, canCreateVideos, canManageUsers, canManageWhiteList, isAdminLike, canAccessPanel } from '../logic/isUserRole'

export const Home = ({ onUserLoggedOut }) => {
    const navigate = useNavigate()

    const { alert } = useContext()

    const [username, setUsername] = useState('World')

    useEffect(() => {
        try {
            logic.getUserUsername()
                .then(username => {
                    setUsername(username)

                    if (canAccessPanel()) {
                        navigate('/admin-panel', { replace: true })
                    } else {
                        navigate('/videos', { replace: true })
                    }
                })
                .catch(error => {
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

    const handleCreateVideoClick = () => navigate('/admin-panel')

    const handleCreateVideoCancelClicked = () => navigate('/admin-panel')

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
        <nav className="mt-4 flex gap-4 border-b pb-2">
            {canSeeStudentArea() && (
                <>
                    <NavLink
                        to="/videos"
                        className={({ isActive }) => isActive ? 'underline font-semibold' : 'opacity-70 hover:underline'}
                    >Videos
                    </NavLink>
                    <NavLink
                        to="/questions"
                        className={({ isActive }) => isActive ? 'underline font-semibold' : 'opacity-70 hover:underline'}
                    >Preguntas
                    </NavLink>
                </>
            )}

            {canAccessPanel() && (
                <NavLink to="/admin-panel" className={({ isActive }) => isActive ? 'underline font-semibold' : 'opacity-70 hover:underline'}>
                    Panel
                </NavLink>
            )}
        </nav>

        <Routes>
            <Route path="/admin-panel" element={canAccessPanel() ? <AdminPanel /> : <Navigate to="/videos" replace />} />

            <Route path="/create-auth-student" element={canManageWhiteList() ? (<CreateAuthStudent
                onCancelClicked={handleCreateAuthStudentCancelClicked}
                onAuthStudentCreated={handleAuthStudentCreated}
            />) : <Navigate to="/admin-panel" replace />} />

            <Route path="/create-video" element={canCreateVideos() ? (<CreateVideo
                onCancelClicked={handleCreateVideoCancelClicked}
                onVideoCreated={handleCreateVideoClick}
            />) : <Navigate to="/admin-panel" replace />} />

            <Route path="/users-list" element={canManageUsers() ? <UsersList
            /> : <Navigate to="/admin-panel" replace />} />

            <Route path="/videos" element={<Videos />} />
            <Route path="/questions" element={<div className="p-5">Preguntas (pendiente)</div>} />

            {/* Redirección por defecto a /videos si cae en / */}
            <Route index element={<Navigate to="/videos" />} />
        </Routes>
    </div>
}
