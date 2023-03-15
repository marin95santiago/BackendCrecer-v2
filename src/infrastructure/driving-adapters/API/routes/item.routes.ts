import { Router } from 'express'
import { validateToken } from '../middlewares/tokenHandler.middleware'
import {
  createItemController,
  getAllItemsController
} from '../controllers/index'

const route = Router()

route.post('/', validateToken, createItemController)
route.get('/', validateToken, getAllItemsController)

export default route
