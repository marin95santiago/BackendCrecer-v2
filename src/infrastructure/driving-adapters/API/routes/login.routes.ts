import { Router } from 'express'

import {
  loginController,
  requestControlCodeController,
  verifyControlCodeController
} from '../controllers/index'

const route = Router()

route.post('', loginController)
route.post('/request-control-code', requestControlCodeController)
route.post('/verify-control-code', verifyControlCodeController)

export default route
