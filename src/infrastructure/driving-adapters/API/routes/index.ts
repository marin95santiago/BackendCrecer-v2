import { Request, Response, Router, NextFunction } from 'express'
import userRoutes from './user.routes'
import loginRoutes from './login.routes'
import billRoutes from './bill.routes'
import entityRoutes from './entity.routes'
import itemRoutes from './item.routes'
import thirdRoutes from './third.routes'
import conceptRoutes from './concept.routes'
import costCenterRoutes from './costCenter.route'
import accountRoutes from './account.routes'
import receiptRoutes from './receipt.routes'
import supportDocumentRoutes from './supportDocument.routes'
import emailRoutes from './email.routes'
import { UserAlreadyExistException } from '../../../../domain/exceptions/user/UserAlreadyExist.exception'
import { UserNotFoundException } from '../../../../domain/exceptions/user/UserNotFound.exception'
import { LoginWrongPasswordException } from '../../../../domain/exceptions/user/LoginWrongPassword.exception'
import { PermissionNotAvailableException } from '../../../../domain/exceptions/common/PermissionNotAvailable.exception'
import { MissingPropertyException } from '../../../../domain/exceptions/common/MissingProperty.exception'
import { EntityAlreadyExistException } from '../../../../domain/exceptions/entity/EntityAlreadyExist.exception'
import { UnhandledException } from '../../../../domain/exceptions/common/Unhandled.exception'
import { AlreadyExistException } from '../../../../domain/exceptions/common/AlreadyExist.exception'

const route = Router()

route.use('/api/v2/user', userRoutes)
route.use('/api/v2/login', loginRoutes)
route.use('/api/v2/bill', billRoutes)
route.use('/api/v2/entity', entityRoutes)
route.use('/api/v2/item', itemRoutes)
route.use('/api/v2/third', thirdRoutes)
route.use('/api/v2/concept', conceptRoutes)
route.use('/api/v2/cost-center', costCenterRoutes)
route.use('/api/v2/account', accountRoutes)
route.use('/api/v2/receipt', receiptRoutes)
route.use('/api/v2/support-document', supportDocumentRoutes)
route.use('/api/v2/email', emailRoutes)

route.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof UserAlreadyExistException) {
    res.status(400).json({
      message: err.message
    })
  } else if (err instanceof UserNotFoundException) {
    res.status(400).json({
      message: err.message
    })
  } else if (err instanceof LoginWrongPasswordException) {
    res.status(400).json({
      message: err.message
    })
  } else if (err instanceof PermissionNotAvailableException) {
    res.status(403).json({
      message: err.message
    })
  } else if (err instanceof MissingPropertyException) {
    res.status(400).json({
      message: err.message
    })
  } else if (err instanceof EntityAlreadyExistException) {
    res.status(400).json({
      message: err.message
    }) 
  } else if (err instanceof UnhandledException) {
    res.status(500).json({
      message: err.message
    }) 
  } else if (err instanceof AlreadyExistException) {
    res.status(400).json({
      message: err.message
    }) 
  } else {
    next(err)
  }
})

route.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err)
  res.status(500)
  res.json({
    error: err
  })
})

export default route
