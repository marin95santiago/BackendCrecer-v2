import { EntityRepository } from '../../../domain/repositories/Entity.repository'
import { ExistEntityByDocumentService } from '../../../domain/services/entity/ExistEntityByDocument.service'
import { EntityAlreadyExistException } from '../../../domain/exceptions/entity/EntityAlreadyExist.exception'
import { Entity } from '../../../domain/entities/Entity.entity'
import { MissingPropertyException } from '../../../domain/exceptions/common/MissingProperty.exception'

export class EntityCreatorUseCase {
  private readonly _entityRepository: EntityRepository
  private readonly _existEntityByDocumentService: ExistEntityByDocumentService

  constructor (entityRepository: EntityRepository) {
    this._entityRepository = entityRepository
    this._existEntityByDocumentService = new ExistEntityByDocumentService(entityRepository)
  }

  async run (body: Entity): Promise<Entity> {
    if (body.name === undefined || body.name === '') throw new MissingPropertyException('name')
    if (body.entityTypeCode === undefined || body.entityTypeCode === '') throw new MissingPropertyException('entityTypeCode')
    if (body.document === undefined || body.document === '') throw new MissingPropertyException('document')
    if (body.signatories === undefined || body.signatories.length === 0) throw new MissingPropertyException('signatories')

    const existEntity: boolean = await this._existEntityByDocumentService.run(body.document)
    if (existEntity) throw new EntityAlreadyExistException()

    await this._entityRepository.save(body)

    return body
  }
}
