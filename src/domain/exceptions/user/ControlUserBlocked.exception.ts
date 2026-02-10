export class ControlUserBlockedException extends Error {
  constructor (public readonly blockedUntil: number) {
    super('Usuario bloqueado temporalmente. Intente más tarde.')
  }
}
