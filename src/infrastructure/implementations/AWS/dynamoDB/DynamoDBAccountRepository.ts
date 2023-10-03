import path from 'path'
import * as dotenv from 'dotenv'
import { DynamoDBClient, PutItemCommand, GetItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { AccountRepository } from '../../../../domain/repositories/Account.repository'
import { Account } from '../../../../domain/entities/Account.entity'

dotenv.config({
  path: path.resolve(__dirname, '../../../../../.env')
})

const ENVIRONMENT = process.env.ENVIRONMENT || ''
const PROJECT = process.env.PROJECT || ''

export class DynamoDBAccountRepository implements AccountRepository {
  private readonly client = new DynamoDBClient({ region: 'us-east-1' })
  private readonly _environment: string
  private readonly _project: string
  private readonly _table: string

  constructor() {
    this._environment = ENVIRONMENT
    this._project = PROJECT
    this._table = 'Accounts'
  }

  async save(account: Account): Promise<Account> {
    try {
      const params = {
        TableName: `${this._project}-${this._environment}-${this._table}`,
        Item: marshall({
          entityId: account.entityId ?? '',
          account: account.account ? Number(account.account) : 0,
          description: account.description ?? '',
          balance: account.balance ? Number(account.balance) : 0
        })
      }

      await this.client.send(new PutItemCommand(params))

      return account
    } catch (error) {
      throw error
    }
  }

  async update(account: Account): Promise<Account> {
    const params = {
      TableName: `${this._project}-${this._environment}-${this._table}`,
      Item: marshall({
        entityId: account.entityId ?? '',
        account: account.account ? Number(account.account) : 0,
        description: account.description ?? '',
        balance: account.balance ? Number(account.balance) : 0
      })
    }
    await this.client.send(new PutItemCommand(params))

    return account
  }

  async getAll(entityId: string, limit?: number, lastEvaluatedKey?: any): Promise<{lastEvaluatedKey: any, accounts: Account[]}> {
    const params : {
      TableName: string
      IndexName: string
      KeyConditionExpression: string
      ExpressionAttributeValues: any
      ExclusiveStartKey?: any
      Limit?: number
    } = {
      TableName: `${this._project}-${this._environment}-${this._table}`,
      IndexName: 'entityId-account-index',
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

    const accounts = items.map((item: any) => {
      return {
        entityId: item.entityId.S ?? '',
        account: Number(item.account.N) ?? 0,
        description: item.description.S ?? '',
        balance: Number(item.balance.N) ?? 0
      }
    })

    return {
      lastEvaluatedKey: response.LastEvaluatedKey,
      accounts: accounts
    }
  }

  async getByAccount(account: number, entityId: string): Promise<Account | null> {
    const params = {
      TableName: `${this._project}-${this._environment}-${this._table}`,
      Key: marshall({
        account,
        entityId
      })
    }

    const response = await this.client.send(new GetItemCommand(params))

    const item = (response.Item !== undefined) ? response.Item : null

    if (item === null) return null

    const accountDb = {
      entityId: item.entityId.S ?? '',
      account: Number(item.account.N) ?? 0,
      description: item.description.S ?? '',
      balance: Number(item.balance.N) ?? 0
    }

    return accountDb
  }
}
