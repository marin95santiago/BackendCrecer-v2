import type { AuthTokenRepository } from '../../../domain/repositories/AuthToken.repository'
import type { IEmailSender } from '../../../domain/entities/EmailSender.entity'
import { GetUserByEmailService } from '../../../domain/services/user/GetUserByEmail.service'
import { UserRepository } from '../../../domain/repositories/User.repository'
import { UserNotFoundException } from '../../../domain/exceptions/user/UserNotFound.exception'
import { UserNotControlUserException } from '../../../domain/exceptions/user/UserNotControlUser.exception'
import { ControlUserBlockedException } from '../../../domain/exceptions/user/ControlUserBlocked.exception'

const CODE_VALIDITY_MS = 5 * 60 * 1000
const BLOCK_DURATION_MS = 2 * 60 * 60 * 1000
const ALPHANUM = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function randomCode (length: number): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += ALPHANUM[Math.floor(Math.random() * ALPHANUM.length)]
  }
  return result
}

export class RequestControlCodeUseCase {
  private readonly _getUserByEmailService: GetUserByEmailService
  constructor (
    private readonly _userRepository: UserRepository,
    private readonly _authTokenRepository: AuthTokenRepository,
    private readonly _emailSender: IEmailSender,
    private readonly _controlUserDomain: string,
    private readonly _masterEmail: string
  ) {
    this._getUserByEmailService = new GetUserByEmailService(_userRepository)
  }

  async run (email: string, clientIp: string): Promise<{ sent: true }> {
    const emailLower = email.trim().toLowerCase()
    const domain = emailLower.split('@')[1] ?? ''

    if (domain !== this._controlUserDomain.toLowerCase()) {
      throw new UserNotControlUserException()
    }

    const now = Date.now()

    const emailBlock = await this._authTokenRepository.getEmailBlock(emailLower)
    if (emailBlock != null && emailBlock.blockedUntil > now) {
      throw new ControlUserBlockedException(emailBlock.blockedUntil)
    }

    const ipBlock = await this._authTokenRepository.getIpBlock(clientIp)
    if (ipBlock != null && ipBlock.blockedUntil > now) {
      throw new ControlUserBlockedException(ipBlock.blockedUntil)
    }

    const user = await this._getUserByEmailService.run(emailLower)
    if (user === null) {
      const count = await this._authTokenRepository.incrementIpAttempts(clientIp)
      if (count >= 2) {
        await this._authTokenRepository.setIpBlock(clientIp, now + BLOCK_DURATION_MS)
      }
      throw new UserNotFoundException()
    }

    const hasControlUser = Array.isArray(user.permissions) && user.permissions.includes('control_user')
    if (!hasControlUser) {
      const count = await this._authTokenRepository.incrementIpAttempts(clientIp)
      if (count >= 2) {
        await this._authTokenRepository.setIpBlock(clientIp, now + BLOCK_DURATION_MS)
      }
      throw new UserNotControlUserException()
    }

    await this._authTokenRepository.resetIpAttempts(clientIp)

    const existing = await this._authTokenRepository.getCodeByEmail(emailLower)
    let requestNumber = 1
    if (existing != null) {
      if (existing.expiration > now) {
        requestNumber = existing.requestNumber
      } else {
        requestNumber = existing.requestNumber + 1
        if (requestNumber > 2) {
          await this._authTokenRepository.setEmailBlock(emailLower, now + BLOCK_DURATION_MS)
          throw new ControlUserBlockedException(now + BLOCK_DURATION_MS)
        }
      }
    }

    const code = randomCode(6)
    const expiration = now + CODE_VALIDITY_MS

    await this._authTokenRepository.saveCode(emailLower, {
      code,
      expiration,
      entityId: user.entityId ?? '',
      requestedBy: emailLower,
      requestNumber
    })

    const html = `
      <p>Se ha solicitado un código de autenticación en 2 pasos para el usuario <strong>${emailLower}</strong>.</p>
      <p><strong>Código:</strong> ${code}</p>
      <p>Válido por 5 minutos. No comparta este código.</p>
    `
    await this._emailSender.send({
      html,
      subject: 'Código de autenticación - Crecer',
      to: this._masterEmail,
      cc: []
    })

    return { sent: true }
  }
}
