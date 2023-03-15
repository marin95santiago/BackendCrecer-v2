export interface Tax {
  tax_id: number
  percent: number
  tax_amount: number
  taxable_amount: number
}

interface Item {
  unit_measure_id: number
  line_extension_amount: number
  free_of_charge_indicator: boolean
  description: string
  notes: string
  code: string
  type_item_identification_id: number
  price_amount: number
  base_quantity: number
  invoiced_quantity: number
  tax_totals: Tax[]
}

export interface ElectronicBill {
  entityId?: string
  userId?: string
  plemsiApiKey?: string
  date: string
  time: string
  prefix: string
  number: number
  orderReference: {
    id_order: string
  }
  send_email: boolean
  customer: {
    identification_number: string
    name: string
    phone: string
    address: string
    email: string
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
    duration_measure: string
  }
  items: Item[]
  resolution: string
  resolutionText: string
  head_note: string
  foot_note: string
  notes: string
  invoiceBaseTotal: number
  invoiceTaxExclusiveTotal: number
  invoiceTaxInclusiveTotal: number
  allTaxTotals: Tax[]
  totalToPay: number
  finalTotalToPay: number
}