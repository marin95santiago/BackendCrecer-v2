import { Item } from 'domain/entities/Item.entity'

export interface ItemRepository {
  getAll: (entityId: string) => Promise<Item[]>
  save: (item: Item) => Promise<Item>
  getByCode: (code: string, entityId: string) => Promise<Item | null>
}
