import { Router } from 'express'
import { validateToken } from '../middlewares/tokenHandler.middleware'
import {
  cancelReceiptController,
  createReceiptController,
  updateReceiptController,
  dailyReportReceiptController,
  getAllReceiptsController,
  getReceiptByCodeController,
} from '../controllers/index'

const route = Router()

route.get('/daily-report', validateToken, dailyReportReceiptController)
route.get('/cancel', validateToken, cancelReceiptController)
route.post('/', validateToken, createReceiptController)
route.get('/', validateToken, getAllReceiptsController)
route.put('/', validateToken, updateReceiptController)
route.get('/:code', validateToken, getReceiptByCodeController)

export default route