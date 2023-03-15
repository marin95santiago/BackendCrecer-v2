/**
 * Build an unhandled error with information about the entity that failed
 * @param entity Entity that failed
 * @return Error
 */
export class UnhandledException extends Error {
  constructor (entity: string) {
    super(`Sorry, something is wrong in ${entity}, please contact technical service`)
  }
}
