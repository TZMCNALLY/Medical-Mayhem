import express from 'express'
const router = express.Router()
import { AuthController } from '../controllers/auth-controller'
import { auth } from '../auth'

router.use('/loggedIn', auth.verifyToken)
router.use('/loggedIn', auth.verifyUserExists)
router.use('/deleteUser', auth.verifyToken)
router.use('/deleteUser', auth.verifyUserExists)

router.post('/register', AuthController.registerUser)
router.post('/login', AuthController.loginUser)
router.post('/logout', AuthController.logoutUser)
router.get('/loggedIn', AuthController.getLoggedIn)
router.post('/deleteUser', AuthController.deleteUser)

export default router