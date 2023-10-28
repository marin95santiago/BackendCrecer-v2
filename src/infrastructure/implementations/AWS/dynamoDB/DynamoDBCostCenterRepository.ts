import path from 'path'
import * as dotenv from 'dotenv'
import { DynamoDBClient, PutItemCommand, GetItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { CostCenterRepository } from '../../../../domain/repositories/CostCenter.repository'
import { CostCenter } from '../../../../domain/entities/CostCenter.entity'

dotenv.config({
  path: path.resolve(__dirname, '../../../../../.env')
})

const ENVIRONMENT = process.env.ENVIRONMENT || ''
const PROJECT = process.env.PROJECT || ''

export class DynamoDBCostCenterRepository implements CostCenterRepository {
  private readonly client = new DynamoDBClient({ region: 'us-east-1' })
  private readonly _environment: string
  private readonly _project: string
  private readonly _table: string

  constructor() {
    this._environment = ENVIRONMENT
    this._project = PROJECT
    this._table = 'CostCenters'
  }

  async save(costCenter: CostCenter): Promise<CostCenter> {
    try {
      const params = {
        TableName: `${this._project}-${this._environment}-${this._table}`,
        Item: marshall({
          entityId: costCenter.entityId ?? '',
          code: costCenter.code ?? '',
          description: costCenter.description ?? '',
          type: costCenter.type ?? ''
        })
      }

      await this.client.send(new PutItemCommand(params))

      return costCenter
    } catch (error) {
      throw error
    }
  }

  async update(costCenter: CostCenter): Promise<CostCenter> {
    const params = {
      TableName: `${this._project}-${this._environment}-${this._table}`,
      Item: marshall({
        entityId: costCenter.entityId ?? '',
        code: costCenter.code ?? '',
        description: costCenter.description ?? '',
        type: costCenter.type ?? ''
      })
    }
    await this.client.send(new PutItemCommand(params))

    return costCenter
  }

  async getAll(entityId: string, limit?: number, lastEvaluatedKey?: any): Promise<{lastEvaluatedKey: any, costCenters: CostCenter[]}> {
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

    const costCenters = items.map((item: any) => {
      return {
        entityId: item.entityId.S ?? '',
        code: item.code.S ?? '',
        description: item.description.S ?? '',
        type: item.type?.M !== undefined
          ?
          {
            code: item.type.M.code.S ?? '',
            description: item.type.M.description.S ?? ''
          }
          : { code: '', description: '' }
      }
    })

    return {
      lastEvaluatedKey: response.LastEvaluatedKey,
      costCenters: costCenters
    }
  }

  async getByCode(code: string, entityId: string): Promise<CostCenter | null> {
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

    const costCenter = {
      entityId: item.entityId.S ?? '',
      code: item.code.S ?? '',
      description: item.description.S ?? '',
      type: item.type?.M !== undefined
        ?
        {
          code: item.type.M.code.S ?? '',
          description: item.type.M.description.S ?? ''
        }
        : { code: '', description: '' }
    }

    return costCenter
  }
}
