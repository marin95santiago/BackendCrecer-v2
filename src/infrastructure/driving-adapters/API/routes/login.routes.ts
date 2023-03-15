import { Router } from 'express'

import {
  loginController
} from '../controllers/index'

const route = Router()

route.post('', loginController)

export default route
