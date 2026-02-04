import { Router } from 'express'
import { validateToken } from '../middlewares/tokenHandler.middleware'
import { sendEmailController } from '../controllers/index'

const route = Router()

route.post('/send', validateToken, sendEmailController)

export default route
