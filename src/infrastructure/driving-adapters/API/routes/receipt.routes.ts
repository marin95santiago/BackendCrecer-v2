import { Router } from 'express'
import { validateToken } from '../middlewares/tokenHandler.middleware'
import {
  createReceiptController, getAllReceiptsController, getReceiptByCodeController,
} from '../controllers/index'

const route = Router()

route.post('/', validateToken, createReceiptController)
route.get('/', validateToken, getAllReceiptsController)
route.get('/:code', validateToken, getReceiptByCodeController)

export default route