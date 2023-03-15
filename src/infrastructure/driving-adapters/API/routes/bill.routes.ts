import { Router } from 'express'
import { validateToken } from '../middlewares/tokenHandler.middleware'
import {
  createElectronicBillController
} from '../controllers/index'

const route = Router()

route.post('/electronic', validateToken, createElectronicBillController)

export default route