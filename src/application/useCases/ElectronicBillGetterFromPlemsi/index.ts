import path from 'path'
import * as dotenv from 'dotenv'
import { EntityRepository } from '../../../domain/repositories/Entity.repository'
import { GetEntityByIdService } from '../../../domain/services/entity/GetEntityById.service'
import { UnhandledException } from '../../../domain/exceptions/common/Unhandled.exception'
import { GetElectronicBillPlemsiService } from '../../../domain/services/electronicBill/getElectronicBillPlemsiList'

dotenv.config({
  path: path.resolve(__dirname, '../../../../.env')
})

export class ElectronicBillGetterFromPlemsiUseCase {
  private readonly _billPlemsiService: GetElectronicBillPlemsiService
  private readonly _getEntityByIdService: GetEntityByIdService

  constructor (entityRepository: EntityRepository) {
    this._billPlemsiService = new GetElectronicBillPlemsiService()
    this._getEntityByIdService = new GetEntityByIdService(entityRepository)
  }

  async run (entityId: string, limit: number): Promise<{ data: any }> {
    try {
      const entity = await this._getEntityByIdService.run(entityId || '')
      if (entity) {
        const response = await this._billPlemsiService.run(entity.apiKeyPlemsi ?? '', limit)

        // Plemsi returns: { code, success, info, data: { totalDocuments, docs, limit, searchAfter, searchBefore } }
        return { data: response.data.data }

      } else {
        throw 'No se encontró la entidad'
      }
  
    } catch (error) {
      throw new UnhandledException(`Facturas electrónicas desde Plemsi, error: ${error}`)
    }
  }
}

