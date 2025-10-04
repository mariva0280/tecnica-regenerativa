import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, NavLink, Navigate } from 'react-router'

import { logic } from '../logic'
import { useContext } from '../context'

import { AdminPanel } from './components/AdminPanel'
import { CreateAuthStudent } from './components/CreateAuthStudent'
import { UsersList } from './components/UsersList'
import { CreateVideo } from './components/CreateVideo'
import { Videos } from './components/Videos'
import { AdminVideoList } from './components/AdminVideoList'
import { Questions } from './components/Questions'

import { canSeeStudentArea, canCreateVideos, canManageUsers, canManageWhiteList, canAccessPanel } from '../logic/isUserRole'

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

    const handleCreateAuthStudentCancelClicked = () => navigate('/admin-panel')

    const handleAuthStudentCreated = () => navigate('/admin-panel')

    const handleCreateVideoClick = () => navigate('/admin-panel')

    const handleCreateVideoCancelClicked = () => navigate('/admin-panel')

    return (
        <div className="p-5 max-w-6xl mx-auto">
            <i className="text-2xl font-bold text-green-600">Logo</i>

            <div className="mt-4 flex items-center justify-between">
                <h1 className="text-xl">Hello, {username}!</h1>

                <button
                    className="inline-flex items-center rounded-2xl bg-green-400 px-4 py-2 text-white font-medium hover:bg-green-500 hover:shadow-md transition-all"
                    type="button"
                    onClick={handleLogoutClick}
                >Logout</button>
            </div>
            <nav className="mt-6 flex gap-6 mb-10">
                {canAccessPanel() && (
                    <NavLink to="/admin-panel" className={({ isActive }) => isActive ? 'text-green-600 underline' : 'text-black/80 hover:text-green-600'}>
                        Panel
                    </NavLink>
                )}

                {canSeeStudentArea() && (
                    <>
                        <NavLink
                            to="/videos"
                            className={({ isActive }) => isActive ? 'text-green-600 underline' : 'text-black/80 hover:text-green-600'}
                        >Videos
                        </NavLink>
                        <NavLink
                            to="/questions"
                            className={({ isActive }) => isActive ? 'text-green-600 underline' : 'text-black/70 hover:text-green-600'}
                        >Preguntas
                        </NavLink>
                    </>
                )}
            </nav>

            <Routes>
                <Route path="/admin-panel" element={canAccessPanel() ? <AdminPanel /> : <Navigate to="/videos" replace />} />

                <Route path="/create-auth-student" element={canManageWhiteList() ? (
                    <CreateAuthStudent
                        onCancelClicked={handleCreateAuthStudentCancelClicked}
                        onAuthStudentCreated={handleAuthStudentCreated}
                    />
                ) : <Navigate to="/admin-panel" replace />} />

                <Route path="/create-video" element={canCreateVideos() ? (
                    <CreateVideo
                        onCancelClicked={handleCreateVideoCancelClicked}
                        onVideoCreated={handleCreateVideoClick}
                    />
                ) : <Navigate to="/admin-panel" replace />} />

                <Route
                    path="/admin-videos"
                    element={canCreateVideos() ? <AdminVideoList /> : <Navigate to="/videos" replace />}
                />

                <Route path="/users-list" element={canManageUsers() ? <UsersList /> : <Navigate to="/admin-panel" replace />} />

                <Route path="/videos" element={<Videos />} />
                <Route path="/questions" element={<Questions />} />

                <Route index element={<Navigate to="/videos" />} />
            </Routes>
        </div>
    )
}
