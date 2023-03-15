import { Router } from 'express'
import { validateToken } from '../middlewares/tokenHandler.middleware'
import {
  createThirdController,
  getAllThirdsController
} from '../controllers/index'

const route = Router()

route.post('/', validateToken, createThirdController)
route.get('/', validateToken, getAllThirdsController)

export default route
