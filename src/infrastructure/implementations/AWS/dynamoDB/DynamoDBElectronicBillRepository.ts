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
        number: Number(bill.number) ?? 0,
        date: bill.date ?? '',
        orderReference: bill.orderReference ?? undefined,
        third: bill.third ?? undefined,
        wayToPay: bill.wayToPay ?? undefined,
        items: bill.items ?? undefined,
        note: bill.note ?? '',
        allTaxTotals: bill.taxes ?? undefined,
        total: bill.total ?? 0,
        totalTaxes: bill.totalTaxes ?? 0,
        totalToPay: bill.totalToPay ?? 0
      })
    }
    await this.client.send(new PutItemCommand(params))

    return bill
  }
}
