export class PermissionNotAvailableException extends Error {
  constructor () {
    super('Sorry, insufficient permissions')
  }
}
