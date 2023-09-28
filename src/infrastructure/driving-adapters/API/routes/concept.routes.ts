import { Router } from 'express'
import { validateToken } from '../middlewares/tokenHandler.middleware'
import {
  createConceptController, getAllConceptsController, getConceptByAccountController, updateConceptController,
} from '../controllers/index'

const route = Router()

route.post('/', validateToken, createConceptController)
route.put('/', validateToken, updateConceptController)
route.get('/', validateToken, getAllConceptsController)
route.get('/:account', validateToken, getConceptByAccountController)

export default route
