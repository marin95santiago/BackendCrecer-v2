import path from 'path'
import * as dotenv from 'dotenv'
import { DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { TransferBetweenAccountRepository } from '../../../../domain/repositories/TransferBetweenAccount.repository'
import { TransferBetweenAccount } from '../../../../domain/entities/TransferBetweenAccount.entity'

dotenv.config({
  path: path.resolve(__dirname, '../../../../../.env')
})

const ENVIRONMENT = process.env.ENVIRONMENT || ''
const PROJECT = process.env.PROJECT || ''

export class DynamoDBTransferBetweenAccountRepository implements TransferBetweenAccountRepository {
  private readonly client = new DynamoDBClient({ region: 'us-east-1' })
  private readonly _environment: string
  private readonly _project: string
  private readonly _table: string

  constructor () {
    this._environment = ENVIRONMENT
    this._project = PROJECT
    this._table = 'TransferBetweenAccounts'
  }

  async save(transfer: TransferBetweenAccount): Promise<TransferBetweenAccount> {
    const params = {
      TableName: `${this._project}-${this._environment}-${this._table}`,
      Item: marshall({
        entityId: transfer.entityId ?? '',
        userId: transfer.userId ?? '',
        date: transfer.date ?? '',
        code: transfer.code ?? '',
        total: transfer.total ?? 0,
        sourceAccount: transfer.sourceAccount ?? 0,
        destinationAccount: transfer.destinationAccount ?? 0,
        status: transfer.status ?? 'VALID'
      })
    }

    await this.client.send(new PutItemCommand(params))
    
    return transfer
  }

  async getAll(entityId: string, limit?: number, lastEvaluatedKey?: any): Promise<{lastEvaluatedKey: any, transfers: TransferBetweenAccount[]}> {
    const params : {
      TableName: string
      IndexName: string
      KeyConditionExpression: string
      ExpressionAttributeValues: any
      ExclusiveStartKey?: any
      Limit?: number
    } = {
      TableName: `${this._project}-${this._environment}-${this._table}`,
      IndexName: 'entityId-index',
      KeyConditionExpression: 'entityId = :entityId',
      ExpressionAttributeValues: {
        ':entityId': {
          S: entityId
        }
      }
    }

    if (limit !== undefined) {
      params.Limit = limit
    }

    if (lastEvaluatedKey !== undefined) {
      params.ExclusiveStartKey = lastEvaluatedKey
    }
    const response = await this.client.send(new QueryCommand(params))

    const items = (response.Items !== undefined) ? response.Items : []

    const transfers = items.map((item: any) => {
      return {
        entityId: item.entityId.S ?? '',
        userId: item.userId.S ?? '',
        date: item.date.S ?? '',
        code: item.code.S ?? '',
        total: item.total.N ? Number(item.total.N) : 0,
        sourceAccount: item.sourceAccount.N ? Number(item.sourceAccount.N) : 0,
        destinationAccount: item.destinationAccount.N ? Number(item.destinationAccount.N) : 0,
        status: item.status.S ?? ''
      }
    })
    
    return {
      lastEvaluatedKey: response.LastEvaluatedKey,
      transfers: transfers
    }
  }

  async getByDateForDailyReport(entityId: string, startDate: string, endDate: string, limit?: number, lastEvaluatedKey?: any): Promise<{ lastEvaluatedKey: any, transfers: any[] }> {
    const params: {
      TableName: string
      IndexName: string
      KeyConditionExpression: string
      ExpressionAttributeValues: any
      ExpressionAttributeNames: any
      ScanIndexForward: boolean
      FilterExpression: string
      ExclusiveStartKey?: any
      Limit?: number
    } = {
      TableName: `${this._project}-${this._environment}-${this._table}`,
      IndexName: 'entityId-date-index',
      KeyConditionExpression: 'entityId = :entityId AND #date BETWEEN :startDate AND :endDate',
      ExpressionAttributeValues: {
        ':entityId': {
          S: entityId
        },
        ':startDate': {
          S: startDate
        },
        ':endDate': {
          S: endDate
        },
        ':status': {
          S: 'VALID'
        }
      },
      ExpressionAttributeNames: {
        '#date': 'date',
        '#status': 'status'
      },
      FilterExpression: '#status = :status',
      ScanIndexForward: false,
    }

    if (limit !== undefined) {
      params.Limit = limit
    }

    if (lastEvaluatedKey !== undefined) {
      params.ExclusiveStartKey = lastEvaluatedKey
    }
    const response = await this.client.send(new QueryCommand(params))

    const items = (response.Items !== undefined) ? response.Items : []

    const transfers = items.map((item: any) => {
      return {
        entityId: item.entityId.S ?? '',
        userId: item.userId.S ?? '',
        date: item.date.S ?? '',
        code: item.code.S ?? '',
        total: item.total.N ? Number(item.total.N) : 0,
        sourceAccount: item.sourceAccount.N ? Number(item.sourceAccount.N) : 0,
        destinationAccount: item.destinationAccount.N ? Number(item.destinationAccount.N) : 0,
        status: item.status.S ?? ''
      }
    })

    return {
      lastEvaluatedKey: response.LastEvaluatedKey,
      transfers: transfers
    }
  }
}
