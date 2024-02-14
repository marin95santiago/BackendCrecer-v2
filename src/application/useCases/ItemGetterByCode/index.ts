import { Item } from '../../../domain/entities/Item.entity'
import { ItemRepository } from '../../../domain/repositories/Item.repository'

export class ItemGetterByCodeUseCase {
  private readonly _itemRepository: ItemRepository

  constructor (itemRepository: ItemRepository) {
    this._itemRepository = itemRepository
  }

  /**
   * Return item by code
   * @param code {string}
   * @returns {Item | null}
   */
  async run (code: string, entityId: string): Promise<Item | null> {
    const item = await this._itemRepository.getByCode(code, entityId)
    return item
  }
}
