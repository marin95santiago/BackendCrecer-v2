import path from 'path'
import * as dotenv from 'dotenv'
import axios, { AxiosResponse } from 'axios'

dotenv.config({
  path: path.resolve(__dirname, '../../../../.env')
})

const URL_PLEMSI = process.env.URL_PLEMSI || ''

export class GetSupportDocumentPlemsiService {
  async run (apiKey: string): Promise<AxiosResponse> {
    try {
      const url = `${URL_PLEMSI}/purchase/invoice?page=1&perPage=500&state=Emit`

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      })

      return response;
    } catch (error) {
      console.log('Error en GetSupportDocumentService ', error)
      throw error
    }
  }
}
