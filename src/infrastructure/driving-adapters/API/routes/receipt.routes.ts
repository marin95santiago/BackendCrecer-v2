import { Router } from 'express'
import { validateToken } from '../middlewares/tokenHandler.middleware'
import {
  createReceiptController, getAllReceiptsController,
} from '../controllers/index'

const route = Router()

route.post('/', validateToken, createReceiptController)
route.get('/', validateToken, getAllReceiptsController)

export default route