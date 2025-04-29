import path from 'path'
import * as dotenv from 'dotenv'
import { EntityRepository } from '../../../domain/repositories/Entity.repository'
import { GetEntityByIdService } from '../../../domain/services/entity/GetEntityById.service'
import { UnhandledException } from '../../../domain/exceptions/common/Unhandled.exception'
import { GetSupportDocumentPlemsiService } from '../../../domain/services/supportDocument/getSupportDocumentPlemsiList'
import { AxiosResponse } from 'axios'

dotenv.config({
  path: path.resolve(__dirname, '../../../../.env')
})

export class SupportDocumentGetterUseCase {
  private readonly _billPlemsiService: GetSupportDocumentPlemsiService
  private readonly _getEntityByIdService: GetEntityByIdService

  constructor (entityRepository: EntityRepository) {
    this._billPlemsiService = new GetSupportDocumentPlemsiService()
    this._getEntityByIdService = new GetEntityByIdService(entityRepository)
  }

  async run (entityId: string, page: number): Promise<{ data: AxiosResponse }> {
    try {
      const entity = await this._getEntityByIdService.run(entityId || '')
      if (entity) {
        // Validate and create bill on DIAN
        const response = await this._billPlemsiService.run(entity.apiKeyPlemsi ?? '', page)

        return { data: response.data }

      } else {
        throw 'No se encontró la entidad'
      }
  
    } catch (error) {
      throw new UnhandledException(`Documento soporte, error: ${error}`)
    }
  }
}
