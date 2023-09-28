import { Concept } from '../../../domain/entities/Concept.entity'
import { ConceptRepository } from '../../../domain/repositories/Concept.repository'
import { ExistConceptByAccountService } from '../../../domain/services/concept/ExistConceptByAccount.service'
import { DoesNotExistException } from '../../../domain/exceptions/common/DoesNotExist.exception'
import { MissingPropertyException } from '../../../domain/exceptions/common/MissingProperty.exception'

export class ConceptUpdaterUseCase {
  private readonly _conceptRepository: ConceptRepository
  private readonly _existConceptByAccount: ExistConceptByAccountService

  constructor(conceptRepository: ConceptRepository) {
    this._conceptRepository = conceptRepository
    this._existConceptByAccount = new ExistConceptByAccountService(conceptRepository)
  }

  async run (body: Concept): Promise<Concept> {
    if (body.description === undefined || body.description === '') throw new MissingPropertyException('description')
    if (body.account === undefined || body.account === 0) throw new MissingPropertyException('account')
    if (body.type.code === undefined || body.type.code === '') throw new MissingPropertyException('type')

    const existItem: boolean = await this._existConceptByAccount.run(body.account, body.entityId)
    if (!existItem) throw new DoesNotExistException('Concept')

    await this._conceptRepository.update(body)

    return body
  }
}
