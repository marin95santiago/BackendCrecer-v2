import path from 'path'
import * as dotenv from 'dotenv'
import { DynamoDBClient, PutItemCommand, GetItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { ReceiptRepository } from '../../../../domain/repositories/Receipt.repository'
import { Receipt } from '../../../../domain/entities/Receipt.entity'

dotenv.config({
  path: path.resolve(__dirname, '../../../../../.env')
})

const ENVIRONMENT = process.env.ENVIRONMENT || ''
const PROJECT = process.env.PROJECT || ''

export class DynamoDBReceiptRepository implements ReceiptRepository {
  private readonly client = new DynamoDBClient({ region: 'us-east-1' })
  private readonly _environment: string
  private readonly _project: string
  private readonly _table: string

  constructor() {
    this._environment = ENVIRONMENT
    this._project = PROJECT
    this._table = 'Receipts'
  }

  async save(receipt: Receipt): Promise<Receipt> {
    try {
      const params = {
        TableName: `${this._project}-${this._environment}-${this._table}`,
        Item: marshall({
          entityId: receipt.entityId ?? '',
          userId: receipt.userId ?? '',
          type: receipt.type ?? undefined,
          date: receipt.date ?? '',
          code: receipt.code ?? '',
          description: receipt.description ?? '',
          thirdDocument: receipt.thirdDocument ?? '',
          totalValueLetter: receipt.totalValueLetter ?? '',
          total: receipt.total ? Number(receipt.total) : 0,
          accounts: receipt.accounts ?? undefined,
          concepts: receipt.concepts ?? undefined
        })
      }

      await this.client.send(new PutItemCommand(params))

      return receipt
    } catch (error) {
      throw error
    }
  }

  async update(receipt: Receipt): Promise<Receipt> {
    const params = {
      TableName: `${this._project}-${this._environment}-${this._table}`,
      Item: marshall({
        entityId: receipt.entityId ?? '',
        userId: receipt.userId ?? '',
        type: receipt.type ?? undefined,
        date: receipt.date ?? '',
        code: receipt.code ?? '',
        description: receipt.description ?? '',
        thirdDocument: receipt.thirdDocument ?? '',
        totalValueLetter: receipt.totalValueLetter ?? '',
        total: receipt.total ? Number(receipt.total) : 0,
        accounts: receipt.accounts ?? undefined,
        concepts: receipt.concepts ?? undefined
      })
    }
    await this.client.send(new PutItemCommand(params))

    return receipt
  }

  async getAll(entityId: string, limit?: number, lastEvaluatedKey?: any): Promise<{lastEvaluatedKey: any, receipts: Receipt[]}> {
    const params : {
      TableName: string
      IndexName: string
      KeyConditionExpression: string
      ExpressionAttributeValues: any
      ExclusiveStartKey?: any
      Limit?: number
    } = {
      TableName: `${this._project}-${this._environment}-${this._table}`,
      IndexName: 'entityId-code-index',
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

    const receipts = items.map((item: any) => {
      return {
        entityId: item.entityId.S ?? '',
        userId: item.userId.S ?? '',
        type: item.type?.M !== undefined
          ?
          {
            code: item.type.M.code.S ?? '',
            description: item.type.M.description.S ?? ''
          }
          : { code: '', description: '' },
        date: item.date.S ?? '',
        code: item.code.S ?? '',
        description: item.description.S ?? '',
        thirdDocument: item.thirdDocument.S ?? '',
        totalValueLetter: item.totalValueLetter.S ?? '',
        total: Number(item.total.N) ?? 0,
        accounts: item.accounts.L !== undefined
          ?
            (
              item.accounts.L.map((account: any) => {
                return {
                  account: Number(account.M.account.N) ?? 0,
                  value: Number(account.M.value.N) ?? 0
                }
              })
            ) 
          : ([{ account: 0, value: 0 }]),
        concepts: item.concepts.L !== undefined
        ?
          (
            item.concepts.L.map((concept: any) => {
              return {
                account: Number(concept.M.account.N) ?? 0,
                value: Number(concept.M.value.N) ?? 0,
                description: concept.M.description.S ?? ''
              }
            })
          ) 
        : ([{ account: 0, value: 0, description: '' }])
      }
    })

    return {
      lastEvaluatedKey: response.LastEvaluatedKey,
      receipts: receipts
    }
  }

  async getByCode(code: string, entityId: string): Promise<Receipt | null> {
    const params = {
      TableName: `${this._project}-${this._environment}-${this._table}`,
      Key: marshall({
        code,
        entityId
      })
    }

    const response = await this.client.send(new GetItemCommand(params))

    const item = (response.Item !== undefined) ? response.Item : null

    if (item === null) return null

    const receipt = {
      entityId: item.entityId.S ?? '',
      userId: item.userId.S ?? '',
      type: item.type?.M !== undefined
        ?
        {
          code: item.type.M.code.S ?? '',
          description: item.type.M.description.S ?? ''
        }
        : { code: '', description: '' },
      date: item.date.S ?? '',
      code: item.code.S ?? '',
      description: item.description.S ?? '',
      thirdDocument: item.thirdDocument.S ?? '',
      totalValueLetter: item.totalValueLetter.S ?? '',
      total: Number(item.total.N) ?? 0,
      accounts: item.accounts.L !== undefined
        ?
          (
            item.accounts.L.map((account: any) => {
              return {
                account: Number(account.M.account.N) ?? 0,
                value: Number(account.M.value.N) ?? 0
              }
            })
          ) 
        : ([{ account: 0, value: 0 }]),
      concepts: item.concepts.L !== undefined
      ?
        (
          item.concepts.L.map((concept: any) => {
            return {
              account: Number(concept.M.account.N) ?? 0,
              value: Number(concept.M.value.N) ?? 0,
              description: concept.M.description.S ?? ''
            }
          })
        ) 
      : ([{ account: 0, value: 0, description: '' }])
    }

    return receipt
  }
}
