export class LoginWrongPasswordException extends Error {
  constructor () {
    super('Invalid password, please verify your password or contact technical service')
  }
}
