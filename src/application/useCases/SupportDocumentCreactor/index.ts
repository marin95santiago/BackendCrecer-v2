import path from 'path'
import * as dotenv from 'dotenv'
import { EntityRepository } from '../../../domain/repositories/Entity.repository'
import { GetEntityByIdService } from '../../../domain/services/entity/GetEntityById.service'
import { UnhandledException } from '../../../domain/exceptions/common/Unhandled.exception'
import { supportDocumentPlemsiMapper } from '../../../domain/mappers/supportDocument'
import { SupportDocumentPlemsiService } from '../../../domain/services/supportDocument/supportDocumentPlemsi.service'
import { AxiosResponse } from 'axios'

dotenv.config({
  path: path.resolve(__dirname, '../../../../.env')
})

const PLEMSI_ERROR_BILL_STILL_PENDING_EMIT_CODE = process.env.PLEMSI_ERROR_BILL_STILL_PENDING_EMIT_CODE || ''

export class SupportDocumentCreatorUseCase {
  private readonly _entityRepository: EntityRepository
  private readonly _billPlemsiService: SupportDocumentPlemsiService
  private readonly _getEntityByIdService: GetEntityByIdService

  constructor (entityRepository: EntityRepository) {
    this._entityRepository = entityRepository
    this._billPlemsiService = new SupportDocumentPlemsiService()
    this._getEntityByIdService = new GetEntityByIdService(entityRepository)
  }

  async run (bill: any): Promise<{ data: AxiosResponse, entityInformation: { apikey: string, number: number }}> {
    try {
      const entity = await this._getEntityByIdService.run(bill.entityId || '')
      if (entity) {
        const number = entity.lastSupportDocumentNumber ? Number(entity.lastSupportDocumentNumber + 1) : 0
        bill.number = number
        const dataPlemsi = supportDocumentPlemsiMapper(bill, {
          resolution: entity.resolutionDS ?? '',
          resolutionText: entity.resolutionTextDS ?? ''
        })

        // Validate and create bill on DIAN
        const response = await this._billPlemsiService.run(dataPlemsi, entity.apiKeyPlemsi ?? '')

        if (response.data.success || response.data.errCode === PLEMSI_ERROR_BILL_STILL_PENDING_EMIT_CODE) {
          await this._entityRepository.update({
            ...entity,
            lastSupportDocumentNumber: number
          })
          const regex = /(https?:\/\/[^\s]+)/g
          const matches = response.data.data.QRCode.match(regex)
          let url = matches ? matches[0] : undefined
          return { data: {...response.data, preview: url }, entityInformation: { apikey: entity.apiKeyPlemsi ?? '', number: number }}
        } else {
          throw 'Error al crear el documento soporte ante la DIAN'
        }
      } else {
        throw 'No se encontró la entidad'
      }
  
    } catch (error) {
      throw new UnhandledException(`Documento soporte, error: ${error}`)
    }
  }
}
