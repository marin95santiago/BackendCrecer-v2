import { UserRepository } from '../../repositories/User.repository'
import { User } from '../../entities/User.entity'

export class GetUserByEmailService {
  private readonly _userRepository: UserRepository

  constructor (userRepository: UserRepository) {
    this._userRepository = userRepository
  }

  /**
   * Return user data
   * @param email {string}
   * @returns {User}
   */
  async run (email: string): Promise<User | null> {
    const user = await this._userRepository.getByEmail(email)

    return user
  }
}
