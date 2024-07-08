import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import api from './auth-request-api'

const AuthContext = createContext();

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    LOGIN_GUEST: "LOGIN_GUEST",
    LOGOUT_GUEST: "LOGOUT_GUEST",
    REGISTER_USER: "REGISTER_USER",
    DELETE_USER: "DELETE_USER",
    ERROR: "ERROR"
}

export const UserRoleType = {
    USER: "USER",
    ADMIN: "ADMIN",
    GUEST: "GUEST",
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        username: "",
        email: "",
        role: null,
        loggedIn: false,
        errorMessage: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
        auth.getLoggedIn();
        // eslint-disable-next-line
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    username: payload.username,
                    email: payload.email,
                    role: payload.role,
                    loggedIn: payload.loggedIn,
                    errorMessage: ""
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    username: payload.username,
                    email: payload.email,
                    role: UserRoleType.USER,
                    loggedIn: true,
                    errorMessage: ""
                })
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    username: payload.username,
                    email: payload.email,
                    role: UserRoleType.USER,
                    loggedIn: true,
                    errorMessage: ""
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    username: '',
                    email: '',
                    role: null,
                    loggedIn: false,
                    errorMessage: ""
                })
            }
            case AuthActionType.LOGIN_GUEST: {

                let guestId = ''

                for (let i = 0; i < 10; i++)
                    guestId += Math.floor(Math.random() * 10)

                return setAuth({
                    username: 'Guest' + guestId,
                    email: '',
                    role: UserRoleType.GUEST,
                    loggedIn: true,
                    errorMessage: ""
                })
            }
            case AuthActionType.LOGOUT_GUEST: {
                return setAuth({
                    username: '',
                    email: '',
                    role: null,
                    loggedIn: false,
                    errorMessage: ""
                })
            }
            case AuthActionType.DELETE_USER: {
                return setAuth({
                    username: '',
                    email: '',
                    role: null,
                    loggedIn: false,
                    errorMessage: ""
                })
            }
            case AuthActionType.ERROR: {
                console.log("AUTH ERROR")
                return setAuth({
                    username: '',
                    email: '',
                    role: null,
                    loggedIn: false,
                    errorMessage: payload.errorMessage
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        try {
            const response = await api.getLoggedIn();
            console.log("AFTER")
            console.log("getLoggedIn response: " + response.status)
            console.log(response)
            if (response.status === 200 && !auth.loggedIn) {
                console.log("LOGGING IN")
                authReducer({
                    type: AuthActionType.GET_LOGGED_IN,
                    payload: {
                        loggedIn: response.data.loggedIn,
                        username: response.data.username,
                        email: response.data.email,
                        role: response.data.isAdmin ? UserRoleType.ADMIN : UserRoleType.USER
                    }
                });
            }
        } catch(error) {
            console.log("LOGGING OUT USER...INVALID TOKEN")
            
            // Log the user out if the token or user no longer exists
            // if not already
            if (auth.loggedIn)
                authReducer( {
                    type: AuthActionType.LOGOUT_USER,
                    payload: null
                })

            // Take them back to the welcome screen
            navigate("/");
        }
    }

    auth.registerUser = async function(username, email, password, passwordVerify) {
        try {
            const response = await api.registerUser(username, email, password, passwordVerify);
            console.log(response);
            if (response.status === 200) {
                console.log("success");
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: { 
                        username: response.data.username,
                        email: response.data.email
                    }
                })
                navigate("/");
            }
        } catch(error) {
            console.log(error.response.data.errorMessage);
            authReducer({
                type: AuthActionType.ERROR,
                payload: { errorMessage: error.response.data.errorMessage }
            })
        }
    }

    auth.loginUser = async function(email, password) {
        console.log("Login user");
        try {
            const response = await api.loginUser(email, password);
            console.log(response);
            if (response.status === 200) {
                console.log("success");
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        username: response.data.username,
                        email: response.data.email
                    }
                })
                navigate("/");
            } 
        } catch(error) {
            console.log(error)
            authReducer({
                type: AuthActionType.ERROR,
                payload: { errorMessage: error.response.data.errorMessage }
            })
        }
    }

    auth.logoutUser = async function(username) {
        const response = await api.logoutUser(username);
        if (response.status === 200) {
            authReducer( {
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            navigate("/");
        }
    }

    auth.loginGuest = function() {
        authReducer( {
            type: AuthActionType.LOGIN_GUEST,
            payload: null
        })
        navigate("/");
    }

    auth.logoutGuest = function() {
        authReducer( {
            type: AuthActionType.LOGOUT_GUEST,
            payload: null
        })
        navigate("/");
    }

    auth.deleteUser = async function() {
        try {
            const response = await api.deleteUser();
            if (response.status === 200) {
                authReducer( {
                    type: AuthActionType.DELETE_USER,
                    payload: null
                })
                navigate("/");
            } 
        } catch(error) {
            console.log(error.response.data.errorMessage);
            authReducer({
                type: AuthActionType.ERROR,
                payload: { errorMessage: error.response.data.errorMessage }
            })
        }
    }

    auth.forgotPassword = async function (email) {
        try {
            console.log(email)
            await api.forgotPassword(email)
        } catch(error) {
            console.log(error)
            console.log(error.response.data.errorMessage);
            authReducer({
                type: AuthActionType.ERROR,
                payload: { errorMessage: error.response.data.errorMessage }
            })
        }
    }

    auth.resetPassword = async function (token, password, passwordVerify) {
        try {
            const response = await api.resetPassword(token, password, passwordVerify)
            alert(response.data.message)
        } catch(error) {
            console.log(error)
            console.log(error.response.data.errorMessage);
            authReducer({
                type: AuthActionType.ERROR,
                payload: { errorMessage: error.response.data.errorMessage }
            })
        }
    }

    auth.hideModal = () => {
        authReducer({
            type: AuthActionType.ERROR,
            payload: { errorMessage: "" }
        });
    }

    auth.isErrorModalOpen = () => {
        return auth.errorMessage !== "";
    }

    auth.error = async function(errorMessage) {
        console.log("error");
        authReducer({
            type: AuthActionType.ERROR,
            payload: { errorMessage: errorMessage }
        });
    }

    return (
        <AuthContext.Provider value={{auth}}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };