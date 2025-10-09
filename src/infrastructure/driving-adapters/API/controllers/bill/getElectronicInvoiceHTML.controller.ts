import { NextFunction, Request, Response } from 'express'
import { DynamoDBEntityRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBEntityRepository'
import { PlemsiDocumentService } from '../../../../../domain/services/electronicBill/PlemsiDocument.service'
import { generateElectronicInvoiceHTML } from '../../../../../domain/services/utils/pdf.helper'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const getElectronicInvoiceHTML = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log('🔍 getElectronicInvoiceHTML - Full req.params:', req.params)
  console.log('🔍 getElectronicInvoiceHTML - Full req.url:', req.url)
  console.log('🔍 getElectronicInvoiceHTML - Full req.path:', req.path)
  
  const { number: invoiceNumber } = req.params
  const { sessionUser } = req.params

  console.log('🔍 getElectronicInvoiceHTML - Raw invoiceNumber from params:', invoiceNumber)
  console.log('🔍 getElectronicInvoiceHTML - Type of invoiceNumber:', typeof invoiceNumber)

  const dynamoDBEntityRepository = new DynamoDBEntityRepository()
  const plemsiDocumentService = new PlemsiDocumentService()

  try {
    const session = JSON.parse(sessionUser)
    
    // Validar y parsear el número de factura
    const parsedInvoiceNumber = parseInt(invoiceNumber)
    console.log('🔍 getElectronicInvoiceHTML - Parsed invoice number:', parsedInvoiceNumber)
    
    if (isNaN(parsedInvoiceNumber)) {
      throw new Error(`Número de factura inválido: ${invoiceNumber}`)
    }
    
    // Obtener la entidad
    const entity = await dynamoDBEntityRepository.getById(session.data.user.entityId)
    if (!entity) {
      throw new Error('Entidad no encontrada')
    }

    console.log('🔍 getElectronicInvoiceHTML - Entity prefix:', entity.prefix)

    // Obtener la factura electrónica desde PLEMSI
    const invoiceData = await plemsiDocumentService.getElectronicInvoice(entity, parsedInvoiceNumber)

    // Generar el HTML
    const htmlContent = await generateElectronicInvoiceHTML(invoiceData, entity)

    // Configurar headers para HTML
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Content-Disposition', `inline; filename="factura-${invoiceNumber}.html"`)

    res.send(htmlContent)
  } catch (error) {
    console.log('❌ getElectronicInvoiceHTML - Error:', error)
    return next(error)
  }
}
