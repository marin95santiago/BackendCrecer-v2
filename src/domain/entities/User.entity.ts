export interface User {
  id: string
  email: string
  password?: string
  name: string
  lastname: string
  entityId: string
  state: string
  permissions: string[]
}
