import { Third } from '../../../domain/entities/Third.entity'
import { ThirdRepository } from '../../../domain/repositories/Third.repository'
import { ExistThirdByDocumentService } from '../../../domain/services/third/ExistThirdByDocument.service'
import { AlreadyExistException } from '../../../domain/exceptions/common/AlreadyExist.exception'
import { MissingPropertyException } from '../../../domain/exceptions/common/MissingProperty.exception'

export class ThirdCreatorUseCase {
  private readonly _thirdRepository: ThirdRepository
  private readonly _existItemByCode: ExistThirdByDocumentService

  constructor(thirdRepository: ThirdRepository) {
    this._thirdRepository = thirdRepository
    this._existItemByCode = new ExistThirdByDocumentService(thirdRepository)
  }

  async run (body: Third): Promise<Third> {
    if (body.document === undefined || body.document === '') throw new MissingPropertyException('document')
    if (body.documentType === undefined) throw new MissingPropertyException('documentType')
    if (body.organizationType === undefined) throw new MissingPropertyException('organizationType')
    if (body.liabilityType === undefined) throw new MissingPropertyException('liabilityType')
    if (body.regimeType === undefined) throw new MissingPropertyException('regimeType')
    if (body.address === undefined) throw new MissingPropertyException('address')
    if (body.email === undefined || body.email === '') throw new MissingPropertyException('email')

    const existItem: boolean = await this._existItemByCode.run(body.document, body.entityId)
    if (existItem) throw new AlreadyExistException('Third')

    await this._thirdRepository.save(body)

    return body
  }
}
