import { ItemPlemsi, TaxPlemsi } from "./ElectronicBill.entity"

interface GeneralAllowance {
  allowance_charge_reason?: string
  allowance_percent: number
  amount: number
  base_amount: number
}

export interface SupportDocumentPlemsi {
  date: string
  time: string
  prefix: string
  number: number
  seller: {
    identification_number: string
    dv?: string
    name: string
    phone: string
    address: string
    email: string
    merchant_registration: string
    type_document_identification_id: number
    type_organization_id: number
    type_liability_id: number
    municipality_id: number
    type_regime_id: number
    postal_zone_code?: string
  }
  payment: {
    payment_form_id: number
    payment_method_id: number
    payment_due_date: string
    duration_measure: string
  }
  generalAllowances?: GeneralAllowance[]
  items: ItemPlemsi[]
  resolution: string
  resolutionText: string
  head_note: string
  allowanceTotal?: number
  invoiceBaseTotal: number
  invoiceTaxExclusiveTotal: number
  invoiceTaxInclusiveTotal: number
  totalToPay: number
  allHoldingsTaxTotals?: TaxPlemsi[]
  allTaxTotals: TaxPlemsi[]
}