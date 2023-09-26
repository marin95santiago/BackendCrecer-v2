import path from 'path'
import * as dotenv from 'dotenv'
import { DynamoDBClient, PutItemCommand, ScanCommand, GetItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { ConceptRepository } from '../../../../domain/repositories/Concept.repository'
import { Concept } from '../../../../domain/entities/Concept.entity'

dotenv.config({
  path: path.resolve(__dirname, '../../../../../.env')
})

const ENVIRONMENT = process.env.ENVIRONMENT || ''
const PROJECT = process.env.PROJECT || ''

export class DynamoDBConceptRepository implements ConceptRepository {
  private readonly client = new DynamoDBClient({ region: 'us-east-1' })
  private readonly _environment: string
  private readonly _project: string
  private readonly _table: string

  constructor() {
    this._environment = ENVIRONMENT
    this._project = PROJECT
    this._table = 'Concepts'
  }

  async save(concept: Concept): Promise<Concept> {
    try {
      const params = {
        TableName: `${this._project}-${this._environment}-${this._table}`,
        Item: marshall({
          entityId: concept.entityId ?? '',
          account: concept.account ? Number(concept.account) : 0,
          description: concept.description ?? '',
          type: concept.type ?? ''
        })
      }

      await this.client.send(new PutItemCommand(params))

      return concept
    } catch (error) {
      throw error
    }
  }

  async getAll(entityId: string): Promise<Concept[]> {
    const params = {
      TableName: `${this._project}-${this._environment}-${this._table}`,
      IndexName: 'entityId-account-index',
      KeyConditionExpression: 'entityId = :entityId',
      ExpressionAttributeValues: {
        ':entityId': {
          S: entityId
        }
      }
    }
    const response = await this.client.send(new ScanCommand(params))

    const items = (response.Items !== undefined) ? response.Items : []

    const concepts = items.map((item: any) => {
      return {
        entityId: item.entityId.S ?? '',
        account: Number(item.account.N) ?? 0,
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

    return concepts
  }

  async getByAccount(account: number, entityId: string): Promise<Concept | null> {
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

    const concept = {
      entityId: item.entityId.S ?? '',
      account: Number(item.account.N) ?? 0,
      description: item.code.S ?? '',
      type: item.type?.M !== undefined
        ?
        {
          code: item.type.M.code.S ?? '',
          description: item.type.M.description.S ?? ''
        }
        : { code: '', description: '' }
    }

    return concept
  }
}
