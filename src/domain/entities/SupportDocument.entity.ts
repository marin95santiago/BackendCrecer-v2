interface AllowCharge {
  charge_indicator: boolean
  allowance_charge_reason: string
  multiplier_factor_numeric: number
  amount: number
  base_amount: number
}

interface GeneralAllowance {
  allowance_charge_reason?: string
  allowance_percent: number
  amount: number
  base_amount: number
}

interface Tax {
  tax_id: number
  percent: number
  tax_amount: number
  taxable_amount: number
}

interface Item {
  unit_measure_id: number
  line_extension_amount: number
  free_of_charge_indicator: boolean
  allowance_charges: AllowCharge[]
  tax_totals: Tax[]
  description: string
  notes: string
  code: string
  type_item_identification_id: number
  price_amount: number
  base_quantity: number
  invoiced_quantity: number
  brandname: string
  modelname: string
  start_date: string
  type_generation_transmition_id: number
}

export interface SupportDocument {
  date: string
  time: string
  prefix: string
  number: number
  seller: {
    identification_number: number
    dv: number
    name: string
    phone: number
    address: string
    postal_zone_code: number
    email: string
    merchant_registration: number
    type_document_identification_id: number
    type_organization_id: number
    type_liability_id: number
    municipality_id: number
    type_regime_id: number
  }
  payment: {
    payment_form_id: number
    payment_method_id: number
    payment_due_date: string
    duration_measure: number
  }
  generalAllowances: GeneralAllowance[]
  items: Item[]
  resolution: number
  resolutionText: string
  head_note: string
  foot_note: string
  allowanceTotal: number
  invoiceBaseTotal: number
  invoiceTaxExclusiveTotal: number
  invoiceTaxInclusiveTotal: number
  totalToPay: number
  allTaxTotals: Tax[]
  allHoldingsTaxTotals: Tax[]
}