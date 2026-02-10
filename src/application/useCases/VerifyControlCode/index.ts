import jwt from 'jsonwebtoken'
import { AuthTokenRepository } from '../../../domain/repositories/AuthToken.repository'
import { GetUserByEmailService } from '../../../domain/services/user/GetUserByEmail.service'
import { GetEntityByIdService } from '../../../domain/services/entity/GetEntityById.service'
import { UserRepository } from '../../../domain/repositories/User.repository'
import { EntityRepository } from '../../../domain/repositories/Entity.repository'
import { ControlCodeExpiredException } from '../../../domain/exceptions/user/ControlCodeExpired.exception'
import { WrongControlCodeException } from '../../../domain/exceptions/user/WrongControlCode.exception'
import { ControlUserBlockedException } from '../../../domain/exceptions/user/ControlUserBlocked.exception'

const BLOCK_DURATION_MS = 2 * 60 * 60 * 1000

export class VerifyControlCodeUseCase {
  private readonly _getUserByEmailService: GetUserByEmailService
  private readonly _getEntityByIdService: GetEntityByIdService

  constructor (
    private readonly _userRepository: UserRepository,
    private readonly _entityRepository: EntityRepository,
    private readonly _authTokenRepository: AuthTokenRepository,
    private readonly _secret: string
  ) {
    this._getUserByEmailService = new GetUserByEmailService(_userRepository)
    this._getEntityByIdService = new GetEntityByIdService(_entityRepository)
  }

  async run (email: string, code: string, clientIp: string): Promise<{ token: string }> {
    const emailLower = email.trim().toLowerCase()
    const codeTrim = code.trim().toUpperCase()
    const now = Date.now()

    const emailBlock = await this._authTokenRepository.getEmailBlock(emailLower)
    if (emailBlock != null && emailBlock.blockedUntil > now) {
      throw new ControlUserBlockedException(emailBlock.blockedUntil)
    }

    const ipBlock = await this._authTokenRepository.getIpBlock(clientIp)
    if (ipBlock != null && ipBlock.blockedUntil > now) {
      throw new ControlUserBlockedException(ipBlock.blockedUntil)
    }

    const pending = await this._authTokenRepository.getByCode(codeTrim)
    if (pending == null) {
      throw new WrongControlCodeException()
    }

    if (pending.requestedBy !== emailLower) {
      throw new WrongControlCodeException()
    }

    if (pending.expiration <= now) {
      await this._authTokenRepository.deleteCode(codeTrim, pending.entityId)
      if (pending.requestNumber >= 2) {
        await this._authTokenRepository.setEmailBlock(emailLower, now + BLOCK_DURATION_MS)
        throw new ControlUserBlockedException(now + BLOCK_DURATION_MS)
      }
      throw new ControlCodeExpiredException()
    }

    await this._authTokenRepository.deleteCode(codeTrim, pending.entityId)

    const user = await this._getUserByEmailService.run(emailLower)
    if (user === null) throw new WrongControlCodeException()

    const entity = await this._getEntityByIdService.run(user.entityId ?? '')
    delete (user as { password?: string }).password

    const token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (120 * 60),
      data: {
        user,
        entity: entity ?? undefined
      }
    }, this._secret)

    return { token }
  }
}
