import { Router } from 'express'
import { validateToken } from '../middlewares/tokenHandler.middleware'
import {
  createElectronicBillController,
  deleteElectronicBillScheduleController,
  getAllElectronicBillsController,
  getElectronicBillByNumberController,
  getElectronicBillSchedulesController
} from '../controllers/index'

const route = Router()

route.get('/electronic', validateToken, getAllElectronicBillsController)
route.get('/electronic/schedule', validateToken, getElectronicBillSchedulesController)
route.delete('/electronic/schedule/:code', validateToken, deleteElectronicBillScheduleController)
route.get('/electronic/:number', validateToken, getElectronicBillByNumberController)
route.post('/electronic', validateToken, createElectronicBillController)

export default route