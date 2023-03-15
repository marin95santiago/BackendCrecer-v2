import path from 'path'
import * as dotenv from 'dotenv'
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { ElectronicBill } from '../../../../domain/entities/ElectronicBill.entity'
import { ElectronicBillRepository } from '../../../../domain/repositories/ElectronicBill.repository'

dotenv.config({
  path: path.resolve(__dirname, '../../../../../.env')
})

export class DynamoDBElectronicBillRepository implements ElectronicBillRepository {
  private readonly client = new DynamoDBClient({ region: 'us-east-1' })
  private readonly _environment: string = process.env.ENVIRONMENT || ''
  private readonly _project: string = process.env.PROJECT || ''
  private readonly _table: string = 'ElectronicBills'

  async save(bill: ElectronicBill): Promise<ElectronicBill> {
    const params = {
      TableName: `${this._project}-${this._environment}-${this._table}`,
      Item: marshall({
        entityId: bill.entityId ?? '',
        userId: bill.userId ?? '',
        plemsiApiKey: bill.plemsiApiKey ?? '',
        date: bill.date ?? '',
        time: bill.time ?? '',
        prefix: bill.prefix ?? '',
        number: bill.number ?? 0,
        orderReference: bill.orderReference ?? undefined,
        send_email: bill.send_email ?? false,
        customer: bill.customer ?? undefined,
        payment: bill.payment ?? undefined,
        items: bill.items ?? undefined,
        resolution: bill.resolution ?? '',
        resolutionText: bill.resolutionText ?? '',
        head_note: bill.head_note ?? '',
        foot_note: bill.foot_note ?? '',
        notes: bill.notes ?? '',
        invoiceBaseTotal: bill.invoiceBaseTotal ?? 0,
        invoiceTaxExclusiveTotal: bill.invoiceTaxExclusiveTotal ?? 0,
        invoiceTaxInclusiveTotal: bill.invoiceTaxInclusiveTotal ?? 0,
        allTaxTotals: bill.allTaxTotals ?? undefined,
        totalToPay: bill.totalToPay ?? 0,
        finalTotalToPay: bill.finalTotalToPay ?? 0
      })
    }
    await this.client.send(new PutItemCommand(params))

    return bill
  }
}
