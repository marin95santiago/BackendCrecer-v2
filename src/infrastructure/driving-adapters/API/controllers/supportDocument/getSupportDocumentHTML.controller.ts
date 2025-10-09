import { NextFunction, Request, Response } from 'express'
import { DynamoDBEntityRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBEntityRepository'
import { PlemsiDocumentService } from '../../../../../domain/services/electronicBill/PlemsiDocument.service'
import { generateElectronicSupportDocumentHTML } from '../../../../../domain/services/utils/pdf.helper'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const getSupportDocumentHTML = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { cude } = req.params
  const { sessionUser } = req.params

  const dynamoDBEntityRepository = new DynamoDBEntityRepository()
  const plemsiDocumentService = new PlemsiDocumentService()

  try {
    const session = JSON.parse(sessionUser)
    
    // Obtener la entidad
    const entity = await dynamoDBEntityRepository.getById(session.data.user.entityId)
    if (!entity) {
      throw new Error('Entidad no encontrada')
    }

    // Obtener el documento soporte desde PLEMSI
    const supportDocumentData = await plemsiDocumentService.getElectronicSupportDocument(entity, cude)

    // Generar el HTML
    const htmlContent = await generateElectronicSupportDocumentHTML(supportDocumentData, entity)

    // Configurar headers para HTML
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Content-Disposition', `inline; filename="documento-soporte-${cude}.html"`)

    res.send(htmlContent)
  } catch (error) {
    return next(error)
  }
}
