import { useContext } from "react";
import { api } from "../store/store-request-api";
import AuthContext from "../auth";
import { useNavigate } from 'react-router-dom';
import GlobalStoreContext from "../store";
import socket from "../constants/socket";
import SocketEvents from "../constants/socketEvents";

// Idea from https://stackoverflow.com/questions/64296505/usecontext-inside-axios-interceptor

const ErrorHandler = ({ children }) => {
    const { auth } = useContext(AuthContext)
    const { store } = useContext(GlobalStoreContext)
    const navigate = useNavigate()

    api.interceptors.response.use(
        response => response, 
        error => {
            let response = error.response
    
            if ( response.status === 404 || response.status === 401 ) {
                socket.emit(SocketEvents.LOGOUT)
                store.reset()
                navigate('/')
                auth.error(response.data.errorMessage)
                console.log("404")
            }
    
            else if (response.status === 401) {
                store.reset()
                navigate('/')
                auth.error(response.data.errorMessage)
                console.log("401")
            }

            throw error
        }
    )
    
    return children
}

export default ErrorHandler