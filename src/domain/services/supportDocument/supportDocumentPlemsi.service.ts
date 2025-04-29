import path from 'path'
import * as dotenv from 'dotenv'
import axios, { AxiosResponse, isAxiosError } from 'axios'
import { SupportDocumentPlemsi } from '../../../domain/entities/SupportDocument.entity'

dotenv.config({
  path: path.resolve(__dirname, '../../../../.env')
})

const URL_PLEMSI = process.env.URL_PLEMSI || ''
const PLEMSI_ERROR_BILL_STILL_PENDING_EMIT_CODE = process.env.PLEMSI_ERROR_BILL_STILL_PENDING_EMIT_CODE || ''

export class SupportDocumentPlemsiService {
  async run (supportDocument: SupportDocumentPlemsi, apiKey: string): Promise<AxiosResponse> {
    try {
      const url = `${URL_PLEMSI}/purchase/invoice`

      const response = await axios.post(url, supportDocument, {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      })

      return response;
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.data?.errCode === PLEMSI_ERROR_BILL_STILL_PENDING_EMIT_CODE) {
          return error.response;
        }
        throw JSON.stringify(error.response?.data)
      } else {
        throw 'Error en el facturador de Plemsi'
      }
    }
  }
}
