import { GetUserByIdService } from '../../../domain/services/user/GetUserById.service'
import { User } from '../../../domain/entities/User.entity'
import { UserRepository } from '../../../domain/repositories/User.repository'
import { UserNotFoundException } from '../../../domain/exceptions/user/UserNotFound.exception'

export class UserUpdaterUseCase {
  private readonly _userRepository: UserRepository
  private readonly _getUserByIdService: GetUserByIdService

  constructor (userRepository: UserRepository) {
    this._userRepository = userRepository
    this._getUserByIdService = new GetUserByIdService(userRepository)
  }

  async run (body: User | any): Promise<User | null> {
    const userToUpdate = await this._getUserByIdService.run(body?.id)

    if (userToUpdate === null) throw new UserNotFoundException()

    userToUpdate.email = body.email ?? userToUpdate.email
    userToUpdate.password = body.password ?? userToUpdate.password
    userToUpdate.name = body.name ?? userToUpdate.name
    userToUpdate.lastname = body.lastname ?? userToUpdate.lastname
    userToUpdate.entityId = body.entityId ?? userToUpdate.entityId
    userToUpdate.state = body.state ?? userToUpdate.state
    userToUpdate.permissions = body.permissions ?? userToUpdate.permissions

    const userUpdated = await this._userRepository.update(userToUpdate)
    return userUpdated
  }
}
