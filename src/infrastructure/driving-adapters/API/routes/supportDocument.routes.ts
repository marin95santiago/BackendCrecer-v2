import { Router } from 'express'
import { validateToken } from '../middlewares/tokenHandler.middleware'
import {
  createSupportDocumentController,
  getSupportDocumentController,
} from '../controllers/index'

const route = Router()

route.get('/', validateToken, getSupportDocumentController)
route.post('/', validateToken, createSupportDocumentController)

export default route