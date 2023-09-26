import path from 'path'
import * as dotenv from 'dotenv'
import axios, { AxiosResponse, isAxiosError } from 'axios'
import { ElectronicBillPlemsi } from '../../../domain/entities/ElectronicBill.entity'

dotenv.config({
  path: path.resolve(__dirname, '../../../../.env')
})

const URL_PLEMSI = process.env.URL_PLEMSI || ''

export class BillPlemsiService {
  async run (electronicBill: ElectronicBillPlemsi, apiKey: string): Promise<AxiosResponse> {
    try {
      const response = await axios.post(URL_PLEMSI, electronicBill, {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      })
      return response
    } catch (error) {
      if (isAxiosError(error)) {
        throw JSON.stringify(error.response?.data)
      } else {
        throw 'Error en el facturador de Plemsi'
      }
    }
  }
}
