import { Third } from 'domain/entities/Third.entity'

export interface ThirdRepository {
  getAll: () => Promise<Third[]>
  save: (third: Third) => Promise<Third>
  getByDocument: (code: string, entityId: string) => Promise<Third | null>
}
