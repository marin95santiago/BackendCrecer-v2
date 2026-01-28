export interface ElectronicBillCreditNote {
  /**
   * Identificador de la entidad que emite la nota crédito.
   */
  entityId: string

  /**
   * Número de la factura sobre la cual se genera la nota crédito.
   */
  billNumber: number
}

