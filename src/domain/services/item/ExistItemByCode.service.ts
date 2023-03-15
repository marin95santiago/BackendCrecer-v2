import { ItemRepository } from '../../repositories/Item.repository'

export class ExistItemByCodeService {
  private readonly _itemRepository: ItemRepository

  constructor (itemRepository: ItemRepository) {
    this._itemRepository = itemRepository
  }

  /**
   * Return true or false if item already exist
   * @param code {string}
   * @returns {boolean} true or false
   */
  async run (code: string, entityId: string): Promise<boolean> {
    const item = await this._itemRepository.getByCode(code, entityId)

    // exist return true
    if (item !== null) return true

    return false
  }
}
