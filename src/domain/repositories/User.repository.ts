import { User } from 'domain/entities/User.entity'

export interface UserRepository {
  getAll: () => Promise<User[]>
  save: (user: User) => Promise<User>
  getByEmail: (email: string) => Promise<User | null>
  update: (user: User) => Promise<User | null>
  delete: (id: string) => Promise<void>
  getById: (id: string) => Promise<User | null>
}
