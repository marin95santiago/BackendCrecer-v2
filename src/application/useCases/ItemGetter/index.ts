import { Item } from '../../../domain/entities/Item.entity'
import { ItemRepository } from '../../../domain/repositories/Item.repository'

export class ItemGetterUseCase {
  private readonly _itemRepository: ItemRepository

  constructor (itemRepository: ItemRepository) {
    this._itemRepository = itemRepository
  }

  async run (entityId: string): Promise<Item[]> {
    const items: Item[] = await this._itemRepository.getAll(entityId)
    return items
  }
}
