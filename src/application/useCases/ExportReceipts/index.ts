import ExcelJS from 'exceljs'
import { Receipt } from '../../../domain/entities/Receipt.entity'
import { ReceiptRepository } from '../../../domain/repositories/Receipt.repository'

export class ReceiptGetterUseCase {
  private readonly _receiptRepository: ReceiptRepository

  constructor(receiptRepository: ReceiptRepository) {
    this._receiptRepository = receiptRepository
  }

  async run(entityId: string): Promise<any> {
    try {
      let response;
      const receipts: Receipt[] = (await this._receiptRepository.getAll(entityId)).receipts
      receipts.forEach((receipt) => {
        
      })
      return response
    } catch (error) {

    }
  }

  generateData(receipts: Receipt[]) {
    const resData: any = []
    receipts.forEach((receipt) => {
      // parsear fecha
      const dateString = receipt.date;
      const dateParts = dateString.split("-");
  
      const year = Number(dateParts[0]);
      const month = Number(dateParts[1]);
      const day = Number(dateParts[2]);
  
      receipt.accounts.forEach(account => {
        let register
        let cuentaContable;
  
        register = {
          codigo: receipt.code,
          tipo_comprobante: receipt.type.code,
          numero: 'C',
          cuenta_contable: "",
          debito_credito: "",
          año: year,
          mes: month,
          dia: day,
          nit: "",
          descripcion_secuencia: ""
        }
  
        resData.push(register)
      })
    })
  
    return resData;
  }
  
}
