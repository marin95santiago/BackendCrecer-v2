import { AccountDailyReport, ConceptDailyReport, DailyReportReceipt } from '../../../domain/entities/DailyReportReceipt.entity'
import { ReceiptRepository } from '../../../domain/repositories/Receipt.repository'
import { MissingPropertyException } from '../../../domain/exceptions/common/MissingProperty.exception'
import { AccountReceipt, ConceptReceipt } from '../../../domain/entities/Receipt.entity'
import { AccountRepository } from '../../../domain/repositories/Account.repository'
import { Account } from '../../../domain/entities/Account.entity'
import { TransferBetweenAccountRepository } from '../../../domain/repositories/TransferBetweenAccount.repository'
import { TransferBetweenAccount } from '../../../domain/entities/TransferBetweenAccount.entity'


export class DailyReportReceiptCreatorUseCase {
  private readonly _receiptRepository: ReceiptRepository
  private readonly _accountRepository: AccountRepository
  private readonly _transferBetweenAccountRepository: TransferBetweenAccountRepository

  constructor(receiptRepository: ReceiptRepository, accountRepository: AccountRepository, transferBetweenAccountRepository: TransferBetweenAccountRepository) {
    this._receiptRepository = receiptRepository
    this._accountRepository = accountRepository
    this._transferBetweenAccountRepository = transferBetweenAccountRepository
  }

  getAccountsWithInitBalanceForDate (accounts: Account[], receipts: any[], transfers: any []) {
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

      transfers.forEach((transfer: any) => {
        if (acc.account === transfer.sourceAccount) {
          acc.balance = acc.balance + transfer.total
        } else if (acc.account === transfer.destinationAccount) {
          acc.balance = acc.balance - transfer.total
        }
      })
    })

    return response
  }

  buildAccountsConceptsForTransfers(impactedAccounts: AccountDailyReport[], impactedConcepts: ConceptDailyReport[], transfer: TransferBetweenAccount) {
    const accounts: AccountDailyReport[] = impactedAccounts
    const concepts: ConceptDailyReport[] = impactedConcepts
  
    accounts.forEach((acc: AccountDailyReport) => {
      if (acc.account === transfer.sourceAccount) {
        // Set concept
        const concept: ConceptDailyReport = {
          description: `Transferencia entre cuentas: origen: ${transfer.sourceAccount}, destino: ${transfer.destinationAccount}`,
          account: transfer.sourceAccount,
          type: {
            code: 'EGR',
            description: 'EGRESO'
          },
          receiptCode: transfer.code,
          value: transfer.total
        }
        concepts.push(concept)

        // Set value
        acc.endBalance -= transfer.total
      } else if (acc.account === transfer.destinationAccount) {
        // Set concept
        const concept: ConceptDailyReport = {
          description: `Transferencia entre cuentas: origen: ${transfer.sourceAccount}, destino: ${transfer.destinationAccount}`,
          account: transfer.sourceAccount,
          type: {
            code: 'ING',
            description: 'INGRESO'
          },
          receiptCode: transfer.code,
          value: transfer.total
        }
        concepts.push(concept)

        // Set value
        acc.endBalance += transfer.total
      }
    })

    return {
      accounts,
      concepts
    }
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

  async run (entityId: string, date: string, toDate?: string): Promise<DailyReportReceipt> {
    if (!date || date === '') throw new MissingPropertyException('date')
    const report: DailyReportReceipt = {
      date: date,
      accounts: [],
      concepts: []
    }

    let dates = [ date ]
  
    if (toDate) {
      dates = generateDatesPeriod(date, toDate)
    }

    const receiptQueries = dates.map(dateFor => {
      return this._receiptRepository.getByDateForDailyReport(entityId, dateFor)
      
    })

    const transferQueries = dates.map(dateFor => {
      return this._transferBetweenAccountRepository.getByDateForDailyReport(entityId, dateFor)
    })

    const receipts = (await Promise.all(receiptQueries)).flatMap(rece => rece.receipts);
  
    const transfers = (await Promise.all(transferQueries)).flatMap(rece => rece.transfers);
    
    const accounts = (await this._accountRepository.getAll(entityId)).accounts

    const accountsWithInitBalanceForDate = this.getAccountsWithInitBalanceForDate(accounts, receipts, transfers)

    report.accounts = accountsWithInitBalanceForDate.map(acc => {
      return {
        account: acc.account,
        description: acc.description,
        initBalance: acc.balance,
        endBalance: acc.balance
      }
    })

    transfers.forEach((transfer: TransferBetweenAccount) => {
      const transfers = this.buildAccountsConceptsForTransfers(report.accounts, report.concepts, transfer)
      report.accounts = transfers.accounts
      report.concepts = transfers.concepts
    })

    receipts.forEach(receipt => {
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

function generateDatesPeriod(date: string, toDate: string): string[] {
  const dates = [];
  let current = new Date(date);
  const end = new Date(toDate);

  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}