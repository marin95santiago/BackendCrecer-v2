import { ElectronicBill } from 'domain/entities/ElectronicBill.entity'

export interface ElectronicBillRepository {
  save: (electronicBill: ElectronicBill) => Promise<ElectronicBill>
}
