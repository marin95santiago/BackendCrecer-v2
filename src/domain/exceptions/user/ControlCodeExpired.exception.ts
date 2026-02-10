export class ControlCodeExpiredException extends Error {
  constructor () {
    super('El código ha expirado.')
  }
}
