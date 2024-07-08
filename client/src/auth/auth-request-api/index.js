import axios from 'axios'
import rootDomain from '../../constants/baseURL';

axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: `${rootDomain}/auth`
})

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /register). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES

export const getLoggedIn = async () => { 
    return await api.get(`/loggedIn/`)
}
export const loginUser = async (email, password) => {
    return await api.post(`/login/`, {
        email : email,
        password : password
    })
}
export const logoutUser = async (username) => { 
    return await api.post(`/logout/`, {username: username});
}
export const deleteUser = async () => { 
    console.log("DELETING USER")
    return await api.post(`/deleteUser/`) 
}
export const registerUser = async (username, email, password, passwordVerify) => {
    return await api.post(`/register/`, {
        username : username,
        email : email,
        password : password,
        passwordVerify : passwordVerify
    })
}

export const forgotPassword = async (email) => {
    console.log(email)
    return await api.post(`/forgotPassword/`, {email: email})
}

export const resetPassword = async (token, password, passwordVerify) => {
    return await api.post(`/resetPassword/`, {
        token: token,
        password : password,
        passwordVerify : passwordVerify
    })
}


const apis = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    deleteUser,
    forgotPassword,
    resetPassword
}

export default apis