import { Item } from '../../../domain/entities/Item.entity'
import { ItemRepository } from '../../../domain/repositories/Item.repository'
import { ExistItemByCodeService } from '../../../domain/services/item/ExistItemByCode.service'
import { AlreadyExistException } from '../../../domain/exceptions/common/AlreadyExist.exception'
import { MissingPropertyException } from '../../../domain/exceptions/common/MissingProperty.exception'

export class ItemCreatorUseCase {
  private readonly _itemRepository: ItemRepository
  private readonly _existItemByCode: ExistItemByCodeService

  constructor(itemRepository: ItemRepository) {
    this._itemRepository = itemRepository
    this._existItemByCode = new ExistItemByCodeService(itemRepository)
  }

  async run (body: Item): Promise<Item> {
    if (body.code === undefined || body.code === '') throw new MissingPropertyException('code')
    if (body.description === undefined || body.description === '') throw new MissingPropertyException('description')

    const existItem: boolean = await this._existItemByCode.run(body.code, body.entityId)
    if (existItem) throw new AlreadyExistException('Item')

    await this._itemRepository.save(body)

    return body
  }
}
