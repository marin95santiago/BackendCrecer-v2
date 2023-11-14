import { Router } from 'express'
import { validateToken } from '../middlewares/tokenHandler.middleware'
import {
  createReceiptController, dailyReportReceiptController, getAllReceiptsController, getReceiptByCodeController,
} from '../controllers/index'

const route = Router()

route.get('/daily-report', validateToken, dailyReportReceiptController)
route.post('/', validateToken, createReceiptController)
route.get('/', validateToken, getAllReceiptsController)
route.get('/:code', validateToken, getReceiptByCodeController)

export default route