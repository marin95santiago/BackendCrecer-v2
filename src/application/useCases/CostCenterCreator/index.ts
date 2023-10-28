import { CostCenter } from '../../../domain/entities/CostCenter.entity'
import { CostCenterRepository } from '../../../domain/repositories/CostCenter.repository'
import { ExistCostCenterByCodeService } from '../../../domain/services/costCenter/ExistCostCenterByCode.service'
import { AlreadyExistException } from '../../../domain/exceptions/common/AlreadyExist.exception'
import { MissingPropertyException } from '../../../domain/exceptions/common/MissingProperty.exception'

export class CostCenterCreatorUseCase {
  private readonly _costCenterRepository: CostCenterRepository
  private readonly _existCostCenterByCode: ExistCostCenterByCodeService

  constructor(costCenterRepository: CostCenterRepository) {
    this._costCenterRepository = costCenterRepository
    this._existCostCenterByCode = new ExistCostCenterByCodeService(costCenterRepository)
  }

  async run (body: CostCenter): Promise<CostCenter> {
    if (body.description === undefined || body.description === '') throw new MissingPropertyException('description')
    if (body.code === undefined || body.code === '') throw new MissingPropertyException('code')
    if (body.type.code === undefined || body.type.code === '') throw new MissingPropertyException('type')

    const existItem: boolean = await this._existCostCenterByCode.run(body.code, body.entityId)
    if (existItem) throw new AlreadyExistException('CostCenter')

    await this._costCenterRepository.save(body)

    return body
  }
}
