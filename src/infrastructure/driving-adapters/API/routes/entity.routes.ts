import { Router } from 'express'
import { validateToken } from '../middlewares/tokenHandler.middleware'
import {
  createEntityController
} from '../controllers/index'

const route = Router()

route.post('/', validateToken, createEntityController)

export default route
