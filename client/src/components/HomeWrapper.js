import { useContext, useState, useEffect } from 'react'
import HomeScreen from './HomeScreen'
import WelcomeScreen from './WelcomeScreen'
import AuthContext from '../auth'

export default function HomeWrapper() {
    const { auth } = useContext(AuthContext)
    const [isAuthorized, setIsAuthorized] = useState(undefined)

    console.log(isAuthorized)

    useEffect(() => {
        console.log("HomeWrapper useEffect")
        console.log("auth.loggedIN: " + auth.loggedIn)
        setIsAuthorized(auth.loggedIn)
    }, [auth.loggedIn])

    if (isAuthorized === undefined) return null

    // TODO: Set user's online status to false when user closes window/tab while website is open
    return (isAuthorized) ? <HomeScreen /> : <WelcomeScreen />;
}