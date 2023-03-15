import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { GetUserByEmailService } from '../../../domain/services/user/GetUserByEmail.service'
import { UserRepository } from '../../../domain/repositories/User.repository'
import { UserNotFoundException } from '../../../domain/exceptions/user/UserNotFound.exception'
import { UnhandledException } from '../../../domain/exceptions/common/Unhandled.exception'
import { LoginWrongPasswordException } from '../../../domain/exceptions/user/LoginWrongPassword.exception'

export class LoginUseCase {
  private readonly _getUserByEmailService: GetUserByEmailService

  constructor (userRepository: UserRepository) {
    this._getUserByEmailService = new GetUserByEmailService(userRepository)
  }

  async run (email: string, password: string, secret: string): Promise<{ token: string }> {
    const userToLogin = await this._getUserByEmailService.run(email)
    if (userToLogin === null) throw new UserNotFoundException()
    if (userToLogin.password === undefined) throw new UnhandledException('Login 1')
    const match = await bcrypt.compare(password, userToLogin.password)
    if (!match) throw new LoginWrongPasswordException()
    // protect password
    delete userToLogin.password
    // Generate token
    const token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (120 * 60),
      data: userToLogin
    }, secret)

    return {
      token
    }
  }
}
