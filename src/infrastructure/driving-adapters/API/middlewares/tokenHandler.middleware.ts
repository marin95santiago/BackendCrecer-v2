import { UnhandledException } from '../../../../domain/exceptions/common/Unhandled.exception'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export const validateToken = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const { authorization } = req.headers
  const token = authorization?.slice(7)
  const secret = process.env.SECRET ?? ''
  try {
    if (token === undefined) return res.status(403).send({ message: 'Token is not supplied' })

    jwt.verify(token ?? '', secret, (error, decoded) => {
      if (error !== null) {
        throw new UnhandledException('Token')
      }
      // Set user information on params
      req.params.sessionUser = JSON.stringify(decoded)
      next()
    })
  } catch (error) {
    return next(error)
  }
}
