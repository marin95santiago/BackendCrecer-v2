import { Router } from 'express'
import { validateToken } from '../middlewares/tokenHandler.middleware'
import {
  createThirdController,
  getAllThirdsController,
  updateThirdController,
  getThirdByDocumentController
} from '../controllers/index'

const route = Router()

route.post('/', validateToken, createThirdController)
route.put('/', validateToken, updateThirdController)
route.get('/', validateToken, getAllThirdsController)
route.get('/:document', validateToken, getThirdByDocumentController)

export default route
