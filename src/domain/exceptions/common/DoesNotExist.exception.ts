export class DoesNotExistException extends Error {
  constructor (entity:string) {
    super(`${entity} does not exist`)
  }
}
