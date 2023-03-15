import { ElectronicBillRepository } from '../../../domain/repositories/ElectronicBill.repository'
import { ElectronicBill } from '../../../domain/entities/ElectronicBill.entity'
import { BillPlemsiService } from '../../../domain/services/electronicBill/BillPlemsi.service'
import { UnhandledException } from '../../../domain/exceptions/common/Unhandled.exception'

export class ElectronicBillCreatorUseCase {
  private readonly _electronicBillRepository: ElectronicBillRepository
  private readonly _billPlemsiService: BillPlemsiService

  constructor (electronicBillRepository: ElectronicBillRepository) {
    this._electronicBillRepository = electronicBillRepository
    this._billPlemsiService = new BillPlemsiService()
  }

  async run (bill: ElectronicBill): Promise<ElectronicBill> {
    try {
      const apiKey = bill.plemsiApiKey || ''
      const billResponse = await this._billPlemsiService.run({
        date: bill.date,
        time: bill.time,
        prefix: bill.prefix,
        number: bill.number,
        orderReference: bill.orderReference,
        send_email: bill.send_email,
        customer: bill.customer,
        payment: bill.payment,
        items: bill.items,
        resolution: bill.resolution,
        resolutionText: bill.resolutionText,
        head_note: bill.head_note,
        foot_note: bill.foot_note,
        notes: bill.notes,
        invoiceBaseTotal: bill.invoiceBaseTotal,
        invoiceTaxExclusiveTotal: bill.invoiceTaxExclusiveTotal,
        invoiceTaxInclusiveTotal: bill.invoiceTaxInclusiveTotal,
        allTaxTotals: bill.allTaxTotals,
        totalToPay: bill.totalToPay,
        finalTotalToPay: bill.finalTotalToPay
      }, apiKey)
  
      if (billResponse.status === 200 || billResponse.status === 201) {
        await this._electronicBillRepository.save(bill)
      } else {
        throw new UnhandledException(`Respuesta de API con estatus: ${billResponse.status}`)
      }
  
      return bill
    } catch (error) {
      throw new UnhandledException(`Problema en el facturador, error: ${error}`)
    }
  }
}
