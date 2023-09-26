import { Router } from 'express'
import { validateToken } from '../middlewares/tokenHandler.middleware'
import {
  createConceptController,
} from '../controllers/index'

const route = Router()

route.post('/', validateToken, createConceptController)

export default route
