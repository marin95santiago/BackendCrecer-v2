export class WrongControlCodeException extends Error {
  constructor () {
    super('Código incorrecto.')
  }
}
