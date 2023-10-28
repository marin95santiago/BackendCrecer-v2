import { Router } from 'express'
import { validateToken } from '../middlewares/tokenHandler.middleware'
import {
  createCostCenterController, getAllCostCentersController, getCostCenterByCodeController, updateCostCenterController,
} from '../controllers/index'

const route = Router()

route.post('/', validateToken, createCostCenterController)
route.put('/', validateToken, updateCostCenterController)
route.get('/', validateToken, getAllCostCentersController)
route.get('/:code', validateToken, getCostCenterByCodeController)

export default route
