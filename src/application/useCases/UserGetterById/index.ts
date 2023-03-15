import { User } from '../../../domain/entities/User.entity'
import { UserRepository } from '../../../domain/repositories/User.repository'

export class UserGetterByIdUseCase {
  private readonly _userRepository: UserRepository

  constructor (userRepository: UserRepository) {
    this._userRepository = userRepository
  }

  async run (id: string): Promise<User | null> {
    const userRes = await this._userRepository.getById(id)
    return userRes
  }
}
