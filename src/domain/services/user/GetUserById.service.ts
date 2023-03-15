import { User } from '../../../domain/entities/User.entity'
import { UserRepository } from '../../../domain/repositories/User.repository'

export class GetUserByIdService {
  private readonly _userRepository: UserRepository

  constructor (userRepository: UserRepository) {
    this._userRepository = userRepository
  }

  /**
   * Return user or null
   * @param id user ID
   * @returns {User} true or false
   */
  async run (id: string): Promise<User | null> {
    const user = await this._userRepository.getById(id)

    return user
  }
}
