import { PlemsiDocumentService } from '../../../domain/services/electronicBill/PlemsiDocument.service'
import { DynamoDBEntityRepository } from '../../../infrastructure/implementations/AWS/dynamoDB/DynamoDBEntityRepository'
import { UnhandledException } from '../../../domain/exceptions/common/Unhandled.exception'

/**
 * Caso de uso para la presentación de una nota crédito
 * a partir del número de una factura electrónica.
 *
 * En este punto aún no existe el servicio de dominio que
 * realizará la presentación real ante DIAN/Plemsi, por lo
 * que este caso de uso actúa como capa de orquestación
 * preparada para integrarse con dicho servicio más adelante.
 */
export class ElectronicBillCreditNotePresenterUseCase {
  /**
   * Ejecuta la presentación de la nota crédito.
   *
   * @param entityId - Identificador de la entidad
   * @param billNumber - Número de la factura sobre la cual se generará la nota crédito
   */
  async run (entityId: string, billNumber: number): Promise<unknown> {

    const dynamoDBEntityRepository = new DynamoDBEntityRepository()
    const plemsiDocumentService = new PlemsiDocumentService()

    // Obtener la entidad
    const entity = await dynamoDBEntityRepository.getById(entityId)
    if (!entity) {
      throw new Error('Entidad no encontrada')
    }

    console.log('🔍 getElectronicInvoiceHTML - Entity prefix:', entity.prefix)

    // Obtener la factura electrónica desde PLEMSI
    const invoiceData = await plemsiDocumentService.getElectronicInvoice(entity, billNumber)

    if (!invoiceData) {
      throw new UnhandledException('Factura electrónica no encontrada')
    }

    // Construir la nota crédito
    const creditNoteData = await plemsiDocumentService.buildCreditNoteFromInvoice(invoiceData.data, entity)

    // Aumentar el número de nota crédito en la entidad
    await dynamoDBEntityRepository.update({
      ...entity,
      lastCreditNumber: entity.lastCreditNumber ? entity.lastCreditNumber + 1 : 1
    })

    return creditNoteData
  }
}

