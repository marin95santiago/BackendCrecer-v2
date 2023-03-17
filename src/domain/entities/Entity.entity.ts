export interface Signatory {
  name: string
  lastname: string
  document: string
  documentType: string
}

export interface Address {
  street: string
  number: string
  province: {
    code: string
    description: string
  }
  country: {
    code: string
    description: string
  }
}

export interface Entity {
  id: string
  name: string
  entityTypeCode: string
  document: string
  signatories?: Signatory[]
  address?: Address
  email?: string
  phone?: string
  apiKeyPlemsi?: string
  state: string
  resolution?: string
  resolutionText?: string,
  lastElectronicBillNumber?: number
}
