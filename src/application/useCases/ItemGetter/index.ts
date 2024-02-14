import { Item } from '../../../domain/entities/Item.entity'
import { ItemRepository } from '../../../domain/repositories/Item.repository'

export class ItemGetterUseCase {
  private readonly _itemRepository: ItemRepository

  constructor (itemRepository: ItemRepository) {
    this._itemRepository = itemRepository
  }

  async run (entityId: string, limit?: number, lastEvaluatedKey?: any): Promise<{ lastEvaluatedKey: any, items: Item[] }> {
    const response: { lastEvaluatedKey: any, items: Item[] } = await this._itemRepository.getAll(entityId, limit, lastEvaluatedKey)
    return response
  }
}
