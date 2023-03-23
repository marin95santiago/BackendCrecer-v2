import { Router } from 'express'
import { validateToken } from '../middlewares/tokenHandler.middleware'
import {
  createEntityController,
  getAllEntitiesController,
  getEntityByIdController
} from '../controllers/index'

const route = Router()

route.post('', validateToken, createEntityController)
route.get('/filter', validateToken, getEntityByIdController)
route.get('', validateToken, getAllEntitiesController)

export default route
