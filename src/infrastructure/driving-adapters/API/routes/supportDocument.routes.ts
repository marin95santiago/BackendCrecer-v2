import { Router } from 'express'
import { validateToken } from '../middlewares/tokenHandler.middleware'
import {
  createSupportDocumentController,
  getSupportDocumentController,
  getSupportDocumentHTMLController,
} from '../controllers/index'

const route = Router()

route.get('/', validateToken, getSupportDocumentController)
route.get('/:cude/html', validateToken, getSupportDocumentHTMLController)
route.post('/', validateToken, createSupportDocumentController)

export default route