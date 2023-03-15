export class MissingPropertyException extends Error {
  constructor (property: string) {
    super(`Missing the property: ${property}`)
  }
}
