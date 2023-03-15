export interface WayPay {
  accountCode: string
  total: number
}

export interface Receipt {
  entityId: string
  userId: string
  movementTypeCode: string
  date: string
  serial: string
  thirdId: string
  selectedThirdRol: string
  totalString: string
  total: number
  wayPays: WayPay[]
  concepts: ['']
}
