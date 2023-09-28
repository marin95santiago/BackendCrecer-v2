import { Router } from 'express'
import { validateToken } from '../middlewares/tokenHandler.middleware'
import {
  createItemController,
  getAllItemsController,
  getItemByCodeController,
  updateItemController
} from '../controllers/index'

const route = Router()

route.post('/', validateToken, createItemController)
route.put('/', validateToken, updateItemController)
route.get('/', validateToken, getAllItemsController)
route.get('/:code', validateToken, getItemByCodeController)

export default route
