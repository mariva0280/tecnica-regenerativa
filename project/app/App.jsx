import { useState } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router'

import { Landing } from './view/Landing'
import { Register } from './view/Register'
import { Login } from './view/Login'
import { Home } from './view/Home'
import { Alert } from './view/components/Alert'
import { Confirm } from './view/components/Confirm'
import { Context } from './context'

import { logic } from './logic'

export const App = () => {
    const navigate = useNavigate()

    const [alertState, setAlertState] = useState(null)
    const [confirmMessage, setConfirmMessage] = useState('')
    const [confirmAction, setConfirmAction] = useState(null)

    const handleRegisterClicked = () => navigate('/register')

    const handleLoginClicked = () => navigate('/login')

    const handleUserRegistered = () => navigate('/login')

    const handleUserLoggedIn = () => navigate('/')

    const handleUserLoggedOut = () => navigate('/login')

    let loggedIn
        try {
            loggedIn = logic.isUserLoggedIn()
        } catch (error) {
            console.error(error)

            handleShowAlert(error.message)
        }

    

    
    const handleAlertAccepted = () => setAlertState(null)

    const handleAcceptConfirm = () => {
        setConfirmMessage('')

        confirmAction.resolve(true)
    }

    const handleCancelConfirm = () => {
        setConfirmMessage('')

        confirmAction.resolve(false)
    }

    const handleShowConfirm = message => {
        setConfirmMessage(message)

        return new Promise((resolve, reject) => {
            setConfirmAction({ resolve })
        })
    }

    const handleShowAlert = (message, variant = 'error') => setAlertState({ message, variant })

    console.log('App -> render')

    return <Context.Provider value={{
        alert: handleShowAlert,
        confirm: handleShowConfirm
    }}>
        {alertState && <Alert message={alertState.message} variant={alertState.variant} onAccepted={handleAlertAccepted} />}

        {confirmMessage && <Confirm message={confirmMessage} onCancelled={handleCancelConfirm} onAccepted={handleAcceptConfirm} />}

        <Routes>
            <Route path='/*' element={
                !loggedIn ?
                <Landing
                    onRegisterClicked={handleRegisterClicked}
                    onLoginClicked={handleLoginClicked}
                />
                :
                <Home onUserLoggedOut={handleUserLoggedOut} />    
            } />

            <Route path='/register' element={
                !loggedIn ?
                <Register
                    onLoginClicked={handleLoginClicked}
                    onUserRegistered={handleUserRegistered}
                />
                :
                <Navigate to='/' />    
            } />

            <Route path='/login' element={
                !loggedIn ?
                    <Login
                       onRegisterClicked={handleRegisterClicked} 
                       onUserLoggedIn={handleUserLoggedIn}
                    />
                    :
                    <Navigate to='/' />
            } />
        </Routes>
    </Context.Provider>
}



