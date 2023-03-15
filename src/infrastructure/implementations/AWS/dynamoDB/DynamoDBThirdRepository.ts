import path from 'path'
import * as dotenv from 'dotenv'
import { DynamoDBClient, PutItemCommand, ScanCommand, GetItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { ThirdRepository } from '../../../../domain/repositories/Third.repository'
import { Third } from '../../../../domain/entities/Third.entity'

dotenv.config({
  path: path.resolve(__dirname, '../../../../../.env')
})

const ENVIRONMENT = process.env.ENVIRONMENT || ''
const PROJECT = process.env.PROJECT || ''

export class DynamoDBThirdRepository implements ThirdRepository {
  private readonly client = new DynamoDBClient({ region: 'us-east-1' })
  private readonly _environment: string
  private readonly _project: string
  private readonly _table: string

  constructor () {
    this._environment = ENVIRONMENT
    this._project = PROJECT
    this._table = 'Thirds'
  }

  async save(third: Third): Promise<Third> {
    const params = {
      TableName: `${this._project}-${this._environment}-${this._table}`,
      Item: marshall({
        entityId: third.entityId ?? '',
        document: third.document ?? '',
        dv: third.dv ?? null,
        documentType: third.documentType ?? null,
        organizationType: third.organizationType ?? null,
        liabilityType: third.liabilityType ?? null,
        regimeType: third.regimeType ?? null,
        name: third.name ?? null,
        lastname: third.lastname ?? null,
        businessName: third.businessName ?? null,
        phone: third.phone ?? null,
        address: third.address ?? null,
        email: third.email ?? null
      })
    }

    await this.client.send(new PutItemCommand(params))
    
    return third
  }

  async getAll(): Promise<Third[]> {
    const params = {
      TableName: `${this._project}-${this._environment}-${this._table}`
    }
    const response = await this.client.send(new ScanCommand(params))

    const items = (response.Items !== undefined) ? response.Items : []

    const third = items.map((item: any) => {
      return {
        entityId: item.entityId.S ?? '',
        document: item.document.S ?? '',
        dv: item.dv.S ?? undefined,
        documentType: item.documentType.M !== undefined
          ?
            {
              code: item.documentType.M.code.S ?? '',
              description: item.documentType.M.description.S ?? ''
            }
          : { code: '', description: '' },
        organizationType: item.organizationType.M !== undefined
          ?
            {
              code: item.organizationType.M.code.S ?? '',
              description: item.organizationType.M.description.S ?? ''
            }
          : { code: '', description: '' },
        liabilityType: item.liabilityType.M !== undefined
          ?
            {
              code: item.liabilityType.M.code.S ?? '',
              description: item.liabilityType.M.description.S ?? ''
            }
          : { code: '', description: '' },
        regimeType: item.regimeType.M !== undefined
          ?
            {
              code: item.regimeType.M.code.S ?? '',
              description: item.regimeType.M.description.S ?? ''
            }
          : { code: '', description: '' },
        name: item.name.S ?? undefined,
        lastname: item.lastname.S ?? undefined,
        businessName: item.businessName.S ?? undefined,
        phone: item.phone.S ?? '',
        address: item.address.S ?? '',
        email: item.email.S ?? ''
      }
    })
    
    return third
  }

  async getByDocument(document: string, entityId: string): Promise<Third | null> {
    const params = {
      TableName: `${this._project}-${this._environment}-${this._table}`,
      Key: marshall({
        document,
        entityId
      })
    }
  
    const response = await this.client.send(new GetItemCommand(params))

    const item = (response.Item !== undefined) ? response.Item : null

    if (item === null) return null

    const third = {
      entityId: item.entityId.S ?? '',
      document: item.document.S ?? '',
      dv: item.dv.S ?? undefined,
      documentType: item.documentType.M !== undefined
        ?
          {
            code: item.documentType.M.code.S ?? '',
            description: item.documentType.M.description.S ?? ''
          }
        : { code: '', description: '' },
      organizationType: item.organizationType.M !== undefined
        ?
          {
            code: item.organizationType.M.code.S ?? '',
            description: item.organizationType.M.description.S ?? ''
          }
        : { code: '', description: '' },
      liabilityType: item.liabilityType.M !== undefined
        ?
          {
            code: item.liabilityType.M.code.S ?? '',
            description: item.liabilityType.M.description.S ?? ''
          }
        : { code: '', description: '' },
      regimeType: item.regimeType.M !== undefined
        ?
          {
            code: item.regimeType.M.code.S ?? '',
            description: item.regimeType.M.description.S ?? ''
          }
        : { code: '', description: '' },
      name: item.name.S ?? undefined,
      lastname: item.lastname.S ?? undefined,
      businessName: item.businessName.S ?? undefined,
      phone: item.phone.S ?? '',
      address: item.address.S ?? '',
      email: item.email.S ?? ''
    }

    return third
  }
}
