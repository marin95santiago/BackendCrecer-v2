import { ReceiptRepository } from '../../../domain/repositories/Receipt.repository'
import { EntityRepository } from '../../../domain/repositories/Entity.repository'
import { AccountRepository } from 'domain/repositories/Account.repository'
import { Receipt } from '../../../domain/entities/Receipt.entity'
import { GetEntityByIdService } from '../../../domain/services/entity/GetEntityById.service'
import { GetAccountByAccountService } from '../../../domain/services/account/GetAccountByAccount.service'
import { UnhandledException } from '../../../domain/exceptions/common/Unhandled.exception'
import { MissingPropertyException } from '../../../domain/exceptions/common/MissingProperty.exception'

export class ReceiptCreatorUseCase {
  private readonly _receiptRepository: ReceiptRepository
  private readonly _entityRepository: EntityRepository
  private readonly _accountRepository: AccountRepository
  private readonly _getEntityByIdService: GetEntityByIdService
  private readonly _getAccountByAccountService: GetAccountByAccountService

  constructor (receiptRepository: ReceiptRepository, entityRepository: EntityRepository, accountRepository: AccountRepository) {
    this._receiptRepository = receiptRepository
    this._entityRepository = entityRepository
    this._accountRepository = accountRepository
    this._getEntityByIdService = new GetEntityByIdService(entityRepository)
    this._getAccountByAccountService = new GetAccountByAccountService(accountRepository)
  }

  async run (receipt: Receipt): Promise<Receipt> {
    try {
      if (receipt.date === undefined || receipt.date === '') throw new MissingPropertyException('date')
      if (receipt.description === undefined || receipt.description === '') throw new MissingPropertyException('description')
      if (receipt.thirdDocument === undefined || receipt.thirdDocument === '') throw new MissingPropertyException('thirdDocument')
      if (receipt.totalValueLetter === undefined || receipt.totalValueLetter === '') throw new MissingPropertyException('totalValueLetter')
      if (receipt.total === undefined) throw new MissingPropertyException('total')
      if (receipt.accounts === undefined || receipt.accounts.length === 0) throw new MissingPropertyException('accounts')
      if (receipt.concepts === undefined || receipt.concepts.length === 0) throw new MissingPropertyException('concepts')
    
      const entity = await this._getEntityByIdService.run(receipt.entityId || '')
      if (entity) {
        // Get accounst for update automatic serial
        const accountsPromises = receipt.accounts.map(acc => {
          return this._getAccountByAccountService.run(acc.account, receipt.entityId)
        })
        const accounts = await Promise.all(accountsPromises)
  

        let codeWithNumber = ''
        entity.receiptNumbers?.forEach(rc => {
          if (rc.prefix === receipt.code) {
            codeWithNumber = `${receipt.code}-${rc.lastReceiptNumber + 1}`
          }
        })

        const promises = [
          this._receiptRepository.save({
            ...receipt,
            code: codeWithNumber
          }),
          this._entityRepository.update({
            ...entity,
            receiptNumbers: entity.receiptNumbers?.map(rc => {
              if (rc.prefix === receipt.code) {
                rc.lastReceiptNumber ++
              }
              return rc
            })
          })
        ]

        // Update account balance
        const accountUpdatePromises = accounts.map(acc => {
          receipt.accounts.forEach((racc => {
            if (acc?.account === racc.account) {
              acc.balance += racc.value
              return this._accountRepository.update(acc)
            }
          }))
        })
        
        // set into db entity, receipt and accounts
        await Promise.all([
          ...promises,
          accountUpdatePromises
        ])

        return {
          ...receipt,
          code: codeWithNumber
        }
      } else {
        throw 'No se encontró la entidad'
      }
  
    } catch (error) {
      throw new UnhandledException(`Problema al registrar recibo, error: ${error}`)
    }
  }
}
