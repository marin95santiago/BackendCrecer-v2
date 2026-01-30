import { Router } from 'express'
import { validateToken } from '../middlewares/tokenHandler.middleware'
import {
  createElectronicBillController,
  deleteElectronicBillScheduleController,
  getAllElectronicBillsController,
  getElectronicBillByNumberController,
  getElectronicInvoiceHTMLController,
  getElectronicBillSchedulesController,
  getElectronicBillsFromPlemsiController,
  getCreditNotesFromPlemsiController,
  presentElectronicBillCreditNoteController
} from '../controllers/index'

const route = Router()

route.get('/electronic', validateToken, getAllElectronicBillsController)
route.get('/electronic/plemsi', validateToken, getElectronicBillsFromPlemsiController)
route.get('/electronic/credit/plemsi', validateToken, getCreditNotesFromPlemsiController)
route.get('/electronic/schedule', validateToken, getElectronicBillSchedulesController)
route.delete('/electronic/schedule/:code', validateToken, deleteElectronicBillScheduleController)
route.get('/electronic/:number', validateToken, getElectronicBillByNumberController)
route.get('/electronic/:number/html', validateToken, getElectronicInvoiceHTMLController)
route.post('/electronic', validateToken, createElectronicBillController)
route.post('/electronic/:number/present-credit', validateToken, presentElectronicBillCreditNoteController)

export default route