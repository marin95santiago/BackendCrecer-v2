import { Router } from 'express'
import { validateToken } from '../middlewares/tokenHandler.middleware'
import {
  createElectronicBillController,
  getAllElectronicBillsController,
  getElectronicBillByNumberController
} from '../controllers/index'

const route = Router()

route.get('/electronic', validateToken, getAllElectronicBillsController)
route.get('/electronic/:number', validateToken, getElectronicBillByNumberController)
route.post('/electronic', validateToken, createElectronicBillController)

export default route