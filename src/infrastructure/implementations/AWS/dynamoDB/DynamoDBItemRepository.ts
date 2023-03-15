import path from 'path'
import * as dotenv from 'dotenv'
import { DynamoDBClient, PutItemCommand, ScanCommand, GetItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { ItemRepository } from '../../../../domain/repositories/Item.repository'
import { Item } from '../../../../domain/entities/Item.entity'

dotenv.config({
  path: path.resolve(__dirname, '../../../../../.env')
})

const ENVIRONMENT = process.env.ENVIRONMENT || ''
const PROJECT = process.env.PROJECT || ''

export class DynamoDBItemRepository implements ItemRepository {
  private readonly client = new DynamoDBClient({ region: 'us-east-1' })
  private readonly _environment: string
  private readonly _project: string
  private readonly _table: string

  constructor () {
    this._environment = ENVIRONMENT
    this._project = PROJECT
    this._table = 'Items'
  }

  async save(item: Item): Promise<Item> {
    const params = {
      TableName: `${this._project}-${this._environment}-${this._table}`,
      Item: marshall({
        entityId: item.entityId ?? '',
        code: item.code ?? '',
        description: item.description ?? '',
        price: item.price ?? null,
        unitMeasure: item.unitMeasure ?? null
      })
    }

    await this.client.send(new PutItemCommand(params))
    
    return item
  }

  async getAll(): Promise<Item[]> {
    const params = {
      TableName: `${this._project}-${this._environment}-${this._table}`
    }
    const response = await this.client.send(new ScanCommand(params))

    const itemsDB = (response.Items !== undefined) ? response.Items : []

    const items = itemsDB.map((item: any) => {
      return {
        entityId: item.entityId.S ?? '',
        code: item.code.S ?? '',
        description: item.description.S ?? '',
        price: Number(item.price.N) ?? undefined,
        unitMeasure: item.unitMeasure.M !== undefined
          ?
            {
              code: Number(item.unitMeasure.M.code.N) ?? 0,
              description: item.unitMeasure.M.description.S ?? ''
            }
          : undefined
      }
    })
    
    return items
  }

  async getByCode(code: string, entityId: string): Promise<Item | null> {
    const params = {
      TableName: `${this._project}-${this._environment}-${this._table}`,
      Key: marshall({
        code,
        entityId
      })
    }
  
    const response = await this.client.send(new GetItemCommand(params))

    const itemDB = (response.Item !== undefined) ? response.Item : null

    if (itemDB === null) return null

    const item = {
      entityId: itemDB.entityId.S ?? '',
      code: itemDB.code.S ?? '',
      description: itemDB.code.S ?? '',
      price: Number(itemDB.price.N) ?? undefined,
      unitMeasure: itemDB.unitMeasure.M !== undefined
        ?
          {
            code: Number(itemDB.unitMeasure.M.code.N) ?? 0,
            description: itemDB.unitMeasure.M.description.S ?? ''
          }
        : undefined
    }

    return item
  }
}
