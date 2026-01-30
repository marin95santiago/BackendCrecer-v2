import path from 'path'
import * as dotenv from 'dotenv'
import { EntityRepository } from '../../../domain/repositories/Entity.repository'
import { GetEntityByIdService } from '../../../domain/services/entity/GetEntityById.service'
import { UnhandledException } from '../../../domain/exceptions/common/Unhandled.exception'
import { GetCreditNotePlemsiService } from '../../../domain/services/electronicBill/getCreditNotePlemsiList'

dotenv.config({
  path: path.resolve(__dirname, '../../../../.env')
})

export class CreditNoteGetterFromPlemsiUseCase {
  private readonly _creditNotePlemsiService: GetCreditNotePlemsiService
  private readonly _getEntityByIdService: GetEntityByIdService

  constructor (entityRepository: EntityRepository) {
    this._creditNotePlemsiService = new GetCreditNotePlemsiService()
    this._getEntityByIdService = new GetEntityByIdService(entityRepository)
  }

  async run (entityId: string, page: number): Promise<{ data: any }> {
    try {
      const entity = await this._getEntityByIdService.run(entityId || '')
      if (entity) {
        const response = await this._creditNotePlemsiService.run(entity.apiKeyPlemsi ?? '', page)

        return { data: response.data.data }
      } else {
        throw 'No se encontró la entidad'
      }
    } catch (error) {
      throw new UnhandledException(`Notas crédito desde Plemsi, error: ${error}`)
    }
  }
}
