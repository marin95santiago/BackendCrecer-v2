import { GetUserByIdService } from '../../../domain/services/user/GetUserById.service'
import { UserRepository } from '../../../domain/repositories/User.repository'
import { UserNotFoundException } from '../../../domain/exceptions/user/UserNotFound.exception'

export class UserDeleterUseCase {
  private readonly _userRepository: UserRepository
  private readonly _getUserByIdService: GetUserByIdService

  constructor (userRepository: UserRepository) {
    this._userRepository = userRepository
    this._getUserByIdService = new GetUserByIdService(userRepository)
  }

  async run (id: string): Promise<void> {
    const userToUpdate = await this._getUserByIdService.run(id)

    if (userToUpdate === null) throw new UserNotFoundException()

    await this._userRepository.delete(id)
  }
}
