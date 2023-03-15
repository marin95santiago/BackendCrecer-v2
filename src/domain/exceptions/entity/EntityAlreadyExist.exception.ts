export class EntityAlreadyExistException extends Error {
  constructor () {
    super('Entity already exist')
  }
}