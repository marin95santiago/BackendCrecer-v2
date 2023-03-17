import path from 'path'
import * as dotenv from 'dotenv'
import { ElectronicBill, ElectronicBillPlemsi, Item, ItemPlemsi, Tax, TaxPlemsi } from "../../entities/ElectronicBill.entity";

dotenv.config({
  path: path.resolve(__dirname, '../../../../.env')
})

const prefixPlemsi = process.env.PREFIX_PLEMSI ?? 'SETT'

interface EntityDataForPlemsi {
  resolution: string
  resolutionText: string
}

export function electronicBillPlemsiMapper(bill: ElectronicBill, entityData: EntityDataForPlemsi): ElectronicBillPlemsi {
  return {
    date: bill.date ?? '',
    time: "12:21:00",
    prefix: prefixPlemsi,
    number: bill.number ?? 0,
    orderReference: {
      id_order: bill.orderReference
    },
    send_email: true,
    customer: {
      identification_number: bill.third.document ?? '',
      dv: bill.third.dv ?? undefined,
      name: (bill.third.name !== undefined ? `${bill.third.name} ${bill.third.lastname}` : bill.third.businessName) ?? '',
      phone: bill.third.phone ?? '',
      address: bill.third.address ?? '',
      email: bill.third.email ?? '',
      type_document_identification_id: Number(bill.third.documentType.code) ?? 0,
      type_organization_id: Number(bill.third.organizationType.code) ?? 0,
      type_liability_id: Number(bill.third.liabilityType.code) ?? 0,
      municipality_id: 635,
      type_regime_id: Number(bill.third.regimeType.code)
    },
    payment: {
      payment_form_id: Number(bill.wayToPay.code) ?? 0,
      payment_method_id: Number(bill.paymentMethod.code) ?? 0,
      payment_due_date: bill.paymentDueDate ?? ''
    },
    items: itemsPlemsiMapper(bill.items),
    resolution: entityData.resolution,
    resolutionText: entityData.resolutionText,
    notes: bill.note ?? '',
    invoiceBaseTotal: Number(bill.total) ?? 0,
    invoiceTaxExclusiveTotal: Number(bill.total) ?? 0,
    invoiceTaxInclusiveTotal: Number(bill.totalToPay) ?? 0,
    allTaxTotals: taxesPlemsiMapper(bill.taxes),
    totalToPay: Number(bill.totalToPay) ?? 0,
    finalTotalToPay: Number(bill.totalToPay) ?? 0
  }
}

export function itemsPlemsiMapper(items: Item[]) : ItemPlemsi[] {
  let response : ItemPlemsi[] = []

  items.forEach(item => {
    response.push({
      unit_measure_id: Number(item.unitMeasure?.code) ?? 0,
      line_extension_amount: Number(item.total) ?? 0,
      free_of_charge_indicator: false,
      description: item.description ?? '',
      code: item.code ?? '',
      type_item_identification_id: Number(item.itemType.code) ?? 0,
      price_amount: Number(item.price) ?? 0,
      base_quantity: Number(item.quantity) ?? 0,
      invoiced_quantity: Number(item.quantity) ?? 0,
      tax_totals: taxesPlemsiMapper(item.taxes)
    })
  })

  return response
}

export function taxesPlemsiMapper(taxes: Tax[]): TaxPlemsi[] {
  let response : TaxPlemsi[] = []
  taxes.forEach(tax => {
    response.push({
      tax_id: Number(tax.code) ?? 0,
      percent: Number(tax.percent) ?? 0,
      tax_amount: Number(tax.taxAmount) ?? 0,
      taxable_amount: Number(tax.taxableAmount) ?? 0
    })
  })

  return response
}