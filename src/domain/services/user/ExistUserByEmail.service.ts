import { UserRepository } from '../../repositories/User.repository'

export class ExistUserByEmailService {
  private readonly _userRepository: UserRepository

  constructor (userRepository: UserRepository) {
    this._userRepository = userRepository
  }

  /**
   * Return true or false if email already exist
   * @param email {string}
   * @returns {boolean} true or false
   */
  async run (email: string): Promise<boolean> {
    const user = await this._userRepository.getByEmail(email)

    // exist return true
    if (user !== null) return true

    return false
  }
}
