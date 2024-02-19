import { Router } from 'express'
import { validateToken } from '../middlewares/tokenHandler.middleware'
import {
  createAccountController,
  getAllAccountsController,
  getAccountByAccountController,
  updateAccountController,
  transferBetweenAccountController
} from '../controllers/index'

const route = Router()

route.post('/', validateToken, createAccountController)
route.put('/', validateToken, updateAccountController)
route.get('/', validateToken, getAllAccountsController)
route.post('/transfer', validateToken, transferBetweenAccountController)
route.get('/:account', validateToken, getAccountByAccountController)

export default route
