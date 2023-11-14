import { AccountDailyReport, ConceptDailyReport, DailyReportReceipt } from '../../../domain/entities/DailyReportReceipt.entity'
import { ReceiptRepository } from '../../../domain/repositories/Receipt.repository'
import { MissingPropertyException } from '../../../domain/exceptions/common/MissingProperty.exception'
import { AccountReceipt, ConceptReceipt } from '../../../domain/entities/Receipt.entity'
import { AccountRepository } from '../../../domain/repositories/Account.repository'
import { Account } from '../../../domain/entities/Account.entity'


export class DailyReportReceiptCreatorUseCase {
  private readonly _receiptRepository: ReceiptRepository
  private readonly _accountRepository: AccountRepository

  constructor(receiptRepository: ReceiptRepository, accountRepository: AccountRepository) {
    this._receiptRepository = receiptRepository
    this._accountRepository = accountRepository
  }

  getAccountsWithInitBalanceForDate (date: string, accounts: Account[], receipts: any[]) {
    const response: Account[] = accounts
    // Modify balance for calculate init balance for date selected
    response.forEach(acc => {
      receipts.forEach(receipt => {
        receipt.accounts.forEach((accReceipt: any) => {
          if (acc.account === accReceipt.account) {
            acc.balance = acc.balance - accReceipt.value
          }
        })
      })
    })

    return response
  }

  buildAccounts (accounts: AccountReceipt[], impactedAccounts: AccountDailyReport[]) {
    const response: AccountDailyReport[] = impactedAccounts
    accounts.forEach((acc: AccountReceipt) => {
      response.forEach(res => {
        if (res.account === acc.account) {
          res.endBalance += acc.value
        }
      })
    })

    return response
  }

  buildConcepts (receipt: any, impactedConcepts: ConceptDailyReport[]) {
    const response: ConceptDailyReport[] = impactedConcepts
    receipt.concepts.forEach((concept: ConceptReceipt) => {
      response.push({
        description: concept.description,
        account: concept.account,
        type: receipt.type,
        receiptCode: receipt.code,
        value: concept.value
      })
    })

    return response
  }

  async run (entityId: string, date: string): Promise<DailyReportReceipt> {
    if (!date || date === '') throw new MissingPropertyException('date')
    const report: DailyReportReceipt = {
      date: date,
      accounts: [],
      concepts: []
    }
    const timestamp = Date.now()
    const dateNow = new Date(timestamp)
    const formattedDate = formatDateToYYYYMMDD(dateNow)
    const receipts = (await this._receiptRepository.getByDateForDailyReport(entityId, date, formattedDate)).receipts
    const accounts = (await this._accountRepository.getAll(entityId)).accounts

    const accountsWithInitBalanceForDate = this.getAccountsWithInitBalanceForDate(date, accounts, receipts)

    report.accounts = accountsWithInitBalanceForDate.map(acc => {
      return {
        account: acc.account,
        description: acc.description,
        initBalance: acc.balance,
        endBalance: acc.balance
      }
    })

    receipts.filter(receipt => receipt.date === date).forEach(receipt => {
      report.accounts = this.buildAccounts(receipt.accounts, report.accounts)
      report.concepts = this.buildConcepts(receipt, report.concepts)
    })

    return report
  }
}

function formatDateToYYYYMMDD(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
