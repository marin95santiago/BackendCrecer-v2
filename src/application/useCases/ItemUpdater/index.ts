import { Item } from '../../../domain/entities/Item.entity'
import { ItemRepository } from '../../../domain/repositories/Item.repository'
import { ExistItemByCodeService } from '../../../domain/services/item/ExistItemByCode.service'
import { DoesNotExistException } from '../../../domain/exceptions/common/DoesNotExist.exception'
import { MissingPropertyException } from '../../../domain/exceptions/common/MissingProperty.exception'

export class ItemUpdaterUseCase {
  private readonly _itemRepository: ItemRepository
  private readonly _existItemByAccount: ExistItemByCodeService

  constructor(itemRepository: ItemRepository) {
    this._itemRepository = itemRepository
    this._existItemByAccount = new ExistItemByCodeService(itemRepository)
  }

  async run (body: Item): Promise<Item> {
    if (body.code === undefined || body.code === '') throw new MissingPropertyException('code')
    if (body.description === undefined || body.description === '') throw new MissingPropertyException('description')

    if (body.account) {
      body.account = Number(body.account)
    }

    const existItem: boolean = await this._existItemByAccount.run(body.code, body.entityId)
    if (!existItem) throw new DoesNotExistException('Item')

    await this._itemRepository.update(body)

    return body
  }
}
