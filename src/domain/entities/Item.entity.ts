export interface Item {
  entityId: string
  code: string
  description: string
  account?: number
  price?: number
  unitMeasure?: {
    code: number
    description: string
  }
  itemType?: {
    code: number
    description: string
  }
}