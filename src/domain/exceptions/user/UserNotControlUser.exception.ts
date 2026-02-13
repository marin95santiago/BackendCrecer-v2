export class UserNotControlUserException extends Error {
  constructor () {
    super('Este usuario no puede usar autenticación en 2 pasos.')
  }
}
