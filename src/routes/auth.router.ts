
import {Router} from 'express'
import AuthController from '../controllers/auth.controller'
import { authenticate, AuthenticatedRequest } from '../middlewares/auth.middleware'


const router = Router()
router.post('/register',AuthController.RegisterUser)
router.post('/login',AuthController.LoginUser)
router.post('/refresh',AuthController.RefreshToken)

router.get('/protected',authenticate,AuthController.ProtectedRoute)

export default router
