import { ElectronicBillRepository } from 'domain/repositories/ElectronicBill.repository'
import { ScheduleRepository } from '../../../domain/repositories/Schedule.repository'
import { ElectronicBillCreatorUseCase } from '../ElectronicBillCreator'
import { EntityRepository } from 'domain/repositories/Entity.repository'

function getCurrentDate(): string {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getCurrentDateV2(): string {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  return `${year}/${month}/${day}`;
}

export class ScheduleExecutorUseCase {
  private readonly _scheduleRepository: ScheduleRepository
  private readonly _electronicBillRepository: ElectronicBillRepository
  private readonly _electronicBillCreatorUseCase:  ElectronicBillCreatorUseCase

  constructor (scheduleRepository: ScheduleRepository, electronicBillRepository: ElectronicBillRepository, entityRepository: EntityRepository) {
    this._scheduleRepository = scheduleRepository
    this._electronicBillRepository = electronicBillRepository
    this._electronicBillCreatorUseCase = new ElectronicBillCreatorUseCase(electronicBillRepository, entityRepository)
  }

  async run (): Promise<string> {
    try {
      const schedules = await this._scheduleRepository.getAll()
      if (schedules && schedules.length > 0) {
        const billPromises: Promise<any>[] = []
        schedules.forEach(schedule => {
          let generateBill = false
          switch (schedule.intervalDays) {
            case 'weekly':
              
              break

            case 'biweekly':
              
              break

            case 'monthly':
              
              break
          
            default:
              break
          }
          const bill = this._electronicBillRepository.getByNumber(schedule.entityId, Number(schedule.idForm))
          billPromises.push(bill)
        })

        const bills = await Promise.all(billPromises)

        if (bills && bills.length > 0) {
          const newBillPromises: Promise<any>[] = []
          bills.forEach(bill => {
            const data = this._electronicBillCreatorUseCase.run({
              ...bill,
              date: getCurrentDate(),
              paymentDueDate: getCurrentDateV2()
            })
            newBillPromises.push(data)
          })
          
          await Promise.all(newBillPromises)
        }
        return 'Se generaron las facturas con exito'
      } else {
        return 'No se encontraros procesos'
      }
    } catch (error) {
      console.error(error)
      return JSON.stringify(error)
    }
    
  }
}
