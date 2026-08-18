import { NextFunction, Request, Response } from 'express'
import { DynamoDBEntityRepository } from '../../../../implementations/AWS/dynamoDB/DynamoDBEntityRepository'
import { PlemsiDocumentService } from '../../../../../domain/services/electronicBill/PlemsiDocument.service'
import { generateElectronicCreditNoteHTML } from '../../../../../domain/services/utils/pdf.helper'

export const getElectronicCreditNoteHTML = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { cude } = req.params
  const { sessionUser } = req.params

  const dynamoDBEntityRepository = new DynamoDBEntityRepository()
  const plemsiDocumentService = new PlemsiDocumentService()

  try {
    const session = JSON.parse(sessionUser)

    const entity = await dynamoDBEntityRepository.getById(session.data.user.entityId)
    if (!entity) {
      throw new Error('Entidad no encontrada')
    }

    const creditNoteData = await plemsiDocumentService.getElectronicCreditNote(entity, cude)

    const htmlContent = await generateElectronicCreditNoteHTML(creditNoteData, entity)

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Content-Disposition', `inline; filename="nota-credito-${cude}.html"`)

    res.send(htmlContent)
  } catch (error) {
    return next(error)
  }
}
