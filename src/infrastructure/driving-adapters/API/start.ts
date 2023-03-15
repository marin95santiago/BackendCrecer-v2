import path from 'path'
import * as dotenv from 'dotenv'
import { Backend } from './Backend'

try {
  dotenv.config({
    path: path.resolve(__dirname, '../../../../.env')
  })

  new Backend().start()
} catch (error) {
  console.log(error)
}
