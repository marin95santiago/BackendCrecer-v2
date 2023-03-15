export class AlreadyExistException extends Error {
  constructor (entity:string) {
    super(`${entity} already exist`)
  }
}
