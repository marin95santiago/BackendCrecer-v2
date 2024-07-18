import { ElectronicBillRepository } from 'domain/repositories/ElectronicBill.repository'
import { ScheduleRepository } from '../../../domain/repositories/Schedule.repository'
import { ElectronicBillCreatorUseCase } from '../ElectronicBillCreator'
import { EntityRepository } from 'domain/repositories/Entity.repository'
export class ScheduleExecutorUseCase {
  private readonly _scheduleRepository: ScheduleRepository
  private readonly _electronicBillRepository: ElectronicBillRepository
  private readonly _electronicBillCreatorUseCase:  ElectronicBillCreatorUseCase
  private DELETE_SCHEDULE = 'DELETE_SCHEDULE'

  constructor (scheduleRepository: ScheduleRepository, electronicBillRepository: ElectronicBillRepository, entityRepository: EntityRepository) {
    this._scheduleRepository = scheduleRepository
    this._electronicBillRepository = electronicBillRepository
    this._electronicBillCreatorUseCase = new ElectronicBillCreatorUseCase(electronicBillRepository, entityRepository)
  }

  async run (): Promise<any[]> {
    try {
      // Get all schedules
      // const schedules = (await this._scheduleRepository.getByEntity('57986ca4-d290-4c80-994f-a8f4da4553b8', 'ElectronicBill')).schedules
      const schedules = await this._scheduleRepository.getAll()

      if (!schedules || schedules.length === 0) {
        throw 'No se encontraros procesos'
      }

      const deleteSchedulePromises: Promise<any>[] = []
      const getBillPromises: Promise<any>[] = []

      schedules.forEach(schedule => {
        // Determinate if generate bill
        const shouldGenerateBill = this.shouldGenerateBill(schedule.startDate, schedule.endDate ?? false , schedule.intervalDays)
        
        if (shouldGenerateBill.generateBill) {
          // Get base bill
          const bill = this._electronicBillRepository.getByNumber(schedule.entityId, Number(schedule.idForm))
          getBillPromises.push(bill)
        } else {
          if (shouldGenerateBill.requireAction === this.DELETE_SCHEDULE) {
            // Delete expired schedules
            const deleteSchedulePromise = this._scheduleRepository.delete(schedule.entityId, schedule.code)
            deleteSchedulePromises.push(deleteSchedulePromise)
          }
        }
      })

      const bills = await Promise.all(getBillPromises)
      const deletedSchedules = await Promise.all(deleteSchedulePromises)
      const finishedActions = deletedSchedules;

      if (bills && bills.length > 0) {
        for (const bill of bills) {
          try {
            console.log(`Processing bill ${bill.number}...`);
            const data = await this._electronicBillCreatorUseCase.run({
              ...bill,
              date: this.getCurrentDate('AAAA-MM-DD'),
              paymentDueDate: this.getCurrentDate('AAAA/MM/DD')
            });
            console.log(`Processed bill ${data.data.number}:`, data);
            finishedActions.push({
              bill: data.data.number,
              status: 'success'
            });
          } catch (error) {
            console.error(`Error processing bill ${bill.number}:`, error);
            finishedActions.push({
              sourceBill: bill.number,
              status: 'error',
              error: error,
              data: bill
            });
          }

          // wait 2 seconds
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      const actions = finishedActions;

      return actions
      
    } catch (error) {
      throw error
    }
  }

  shouldGenerateBill(startDate: string, endDate: string | false, interval: string) {
    let response = {
      generateBill: false,
      requireAction: ''
    }

    const currentDate = this.getCurrentDate('AAAA-MM-DD')
    
    if (endDate) {
      const currentDatePoc = new Date()
      const endDatePoc = new Date(endDate)
      if (endDatePoc <= currentDatePoc) {
        response.requireAction = this.DELETE_SCHEDULE
        return response
      }
    }

    // Case first scheduled bill
    if (startDate === currentDate) {
      response.generateBill = true
      return response
    } 
  
    switch (interval) {
      case 'weekly':
        const dayForStartDate = this.getDayOfWeek(startDate)
        const dayForCurrentDate = this.getDayOfWeek(currentDate) 
        response.generateBill = (dayForStartDate === dayForCurrentDate)
        break
  
      case 'monthly':
        const dayMontStartDate = this.getDayAndMont(startDate)
        const dayMontCurrentDate = this.getDayAndMont(currentDate)
  
        response.generateBill = (dayMontStartDate.day === dayMontCurrentDate.day && dayMontStartDate.month !== dayMontCurrentDate.month)
        break
    
      default:
        break
    }
  
    return response
  }

  getCurrentDate(format: 'AAAA-MM-DD' | 'AAAA/MM/DD'): string {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0')
  
    let response = ''
  
    switch (format) {
      case 'AAAA-MM-DD':
        response = `${year}-${month}-${day}`
        break
  
      case 'AAAA/MM/DD':
        response = `${year}/${month}/${day}`
        break
    
      default:
        break
    }
  
    return response
  }
  
  getDayOfWeek(formatedDate: string) {
    const date = new Date(formatedDate)
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dayIndex = date.getDay()

    return daysOfWeek[dayIndex]
  }
  
  getDayAndMont(formatedDate: string) {
    const date = new Date(formatedDate)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    
    return {
      day,
      month
    }
  }
}
