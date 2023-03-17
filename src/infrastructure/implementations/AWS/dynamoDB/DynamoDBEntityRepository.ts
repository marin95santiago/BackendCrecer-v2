import path from 'path'
import * as dotenv from 'dotenv'
import { DynamoDBClient, PutItemCommand, ScanCommand, GetItemCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { Entity } from 'domain/entities/Entity.entity'
import { EntityRepository } from '../../../../domain/repositories/Entity.repository'

dotenv.config({
  path: path.resolve(__dirname, '../../../../../.env')
})

export class DynamoDBEntityRepository implements EntityRepository {
  private readonly client = new DynamoDBClient({ region: 'us-east-1' })
  private readonly _environment: string = process.env.ENVIRONMENT || ''
  private readonly _project: string = process.env.PROJECT || ''
  private readonly _table: string = 'Entities'

  async save(entity: Entity): Promise<Entity> {
    const params = {
      TableName: `${this._project}-${this._environment}-${this._table}`,
      Item: marshall({
        id: entity.id ?? '',
        name: entity.name ?? '',
        entityTypeCode: entity.entityTypeCode ?? '',
        document: entity.document ?? '',
        signatories: entity.signatories ?? null,
        address: entity.address ?? null,
        email: entity.email ?? '',
        phone: entity.phone ?? null,
        apiKeyPlemsi: entity.apiKeyPlemsi ?? null,
        state: entity.state ?? '',
        resolution: entity.resolution ?? null,
        resolutionText: entity.resolutionText ?? null,
        lastElectronicBillNumber: entity.lastElectronicBillNumber ?? null
      })
    }
    await this.client.send(new PutItemCommand(params))

    return entity
  }
  /*
  async getAll(): Promise<Entity[]> {
    const params = {
      TableName: `${this._project}-${this._environment}-Users`
    }
    const response = await this.client.send(new ScanCommand(params))

    const items = (response.Items !== undefined) ? response.Items : []

    const users = items.map((item: any) => {
      return {
        id: item.id.S ?? '',
        email: item.email.S ?? '',
        name: item.name.S ?? '',
        lastname: item.lastname.S ?? '',
        entityId: item.entityId.S ?? '',
        state: item.state.S ?? '',      
        permissions: item.permissions.L !== undefined
          ? item.permissions.L.map((permission: { S: string | undefined }) => {
            if (permission.S !== undefined) {
              return permission.S
            } else {
              return ''
            }
          })
          : ['']
      }
    })

    return users
  }
  */
  async getById(id: string): Promise<Entity | null> {
    const params = {
      TableName: `${this._project}-${this._environment}-${this._table}`,
      Key: marshall({
        id
      })
    }
    const response = await this.client.send(new GetItemCommand(params))

    const item = (response.Item !== undefined) ? response.Item : null

    if (item === null) return null
    const entity = {
      id: item.id.S ?? '',
      name: item.name.S ?? '',
      entityTypeCode: item.entityTypeCode.S ?? '',
      document: item.document.S ?? '',
      address: item.address.M !== undefined
        ?
          {
            street: item.address.M.street.S ?? '',
            number: item.address.M.number.S ?? '',
            province: item.address.M.province.M !== undefined 
              ?
                {
                  code: item.address.M.province.M.code.S ?? '',
                  description: item.address.M.province.M.description.S ?? ''
                }
              : { code: '', description: '' },
            country: item.address.M.country.M !== undefined 
              ?
                {
                  code: item.address.M.country.M.code.S ?? '',
                  description: item.address.M.country.M.description.S ?? ''
                }
              : { code: '', description: '' },
          }
        : undefined,
      email: item.email.S ?? '',
      phone: item.phone.S ?? '',
      apiKeyPlemsi: item.apiKeyPlemsi.S ?? undefined,
      state: item.state.S ?? '',
      signatories: item.signatories.L !== undefined
        ? item.signatories.L.map(signatory => {
          if (signatory.M !== undefined) {
            return {
              name: signatory.M.name.S ?? '',
              lastname: signatory.M.lastname.S ?? '',
              document: signatory.M.document.S ?? '',
              documentType: signatory.M.documentType.S ?? ''
            }
          } else {
            return {
              name: '',
              lastname: '',
              document: '',
              documentType: ''
            }
          }
        })
        : undefined,
      resolution: item.resolution.S ?? undefined,
      resolutionText: item.resolutionText.S ?? undefined,
      lastElectronicBillNumber: Number(item.lastElectronicBillNumber.N) ?? undefined
    }

    return entity
  }

  async getByDocument(document: string): Promise<Entity | null> {
    const params = {
      TableName: `${this._project}-${this._environment}-${this._table}`,
      FilterExpression: 'document = :document',
      ExpressionAttributeValues: marshall({
        ':document': document
      },
      {
        removeUndefinedValues: true
      })
    }
    const response = await this.client.send(new ScanCommand(params))

    const item = (response.Items !== undefined && response.Items.length > 0) ? response.Items[0] : null

    if (item === null) return null

    const entity = {
      id: item.id.S ?? '',
      name: item.name.S ?? '',
      entityTypeCode: item.entityTypeCode.S ?? '',
      document: item.document.S ?? '',
      address: item.address.M !== undefined
        ?
          {
            street: item.address.M.street.S ?? '',
            number: item.address.M.number.S ?? '',
            province: item.address.M.province.M !== undefined 
              ?
                {
                  code: item.address.M.province.M.code.S ?? '',
                  description: item.address.M.province.M.description.S ?? ''
                }
              : { code: '', description: '' },
            country: item.address.M.country.M !== undefined 
              ?
                {
                  code: item.address.M.country.M.code.S ?? '',
                  description: item.address.M.country.M.description.S ?? ''
                }
              : { code: '', description: '' },
          }
        : undefined,
      email: item.email.S ?? '',
      phone: item.phone.S ?? '',
      apiKeyPlemsi: item.apiKeyPlemsi.S ?? undefined,
      state: item.state.S ?? '',
      signatories: item.signatories.L !== undefined
        ? item.signatories.L.map(signatory => {
          if (signatory.M !== undefined) {
            return {
              name: signatory.M.name.S ?? '',
              lastname: signatory.M.lastname.S ?? '',
              document: signatory.M.document.S ?? '',
              documentType: signatory.M.documentType.S ?? ''
            }
          } else {
            return {
              name: '',
              lastname: '',
              document: '',
              documentType: ''
            }
          }
        })
        : undefined,
      resolution: item.resolution.S ?? undefined,
      resolutionText: item.resolutionText.S ?? undefined,
      lastElectronicBillNumber: Number(item.lastElectronicBillNumber.N) ?? undefined
    }

    return entity
  }
  
  async update(entity: Entity): Promise<Entity> {
    const params = {
      TableName: `${this._project}-${this._environment}-${this._table}`,
      Item: marshall({
        id: entity.id ?? '',
        name: entity.name ?? '',
        entityTypeCode: entity.entityTypeCode ?? '',
        document: entity.document ?? '',
        signatories: entity.signatories ?? null,
        address: entity.address ?? null,
        email: entity.email ?? '',
        phone: entity.phone ?? null,
        apiKeyPlemsi: entity.apiKeyPlemsi ?? null,
        state: entity.state ?? '',
        resolution: entity.resolution ?? null,
        resolutionText: entity.resolutionText ?? null,
        lastElectronicBillNumber: entity.lastElectronicBillNumber ?? null
      })
    }
    await this.client.send(new PutItemCommand(params))

    return entity
  }

  /*
  async delete(id: string): Promise<void> {
    const params = {
      TableName: `${this._project}-${this._environment}-Users`,
      Key: marshall({
        id
      })
    }
    await this.client.send(new DeleteItemCommand(params))
  }
  */
}
