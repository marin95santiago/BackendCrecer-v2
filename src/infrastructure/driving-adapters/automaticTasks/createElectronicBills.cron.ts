import { DynamoDBEntityRepository } from '../../../infrastructure/implementations/AWS/dynamoDB/DynamoDBEntityRepository';
import { DynamoDBScheduleRepository } from '../../../infrastructure/implementations/AWS/dynamoDB/DynamoDBScheduleRepository';
import { DynamoDBElectronicBillRepository } from '../../../infrastructure/implementations/AWS/dynamoDB/DynamoDBElectronicBillRepository';
import { ScheduleExecutorUseCase } from '../../../application/useCases/ScheduleExecutor';
import cron from 'node-cron';

// Define the task to be executed
const task = cron.schedule('55 0 * * *', async () => {
  console.log('Running a task every day at 2 AM');
  // Aquí puedes llamar a la función o proceso que necesitas ejecutar
  await handler();
}, {
  scheduled: true,
  timezone: "America/Bogota" // Ajusta la zona horaria a Colombia
});

// Function to be executed by the cron job
async function handler() {
  // Tu código aquí
  const dynamoDBScheduleRepository = new DynamoDBScheduleRepository()
  const dynamoDBElectronicBillRepository = new DynamoDBElectronicBillRepository()
  const dynamoDBEntityRepository = new DynamoDBEntityRepository()
  const scheduleExecutorUseCase = new ScheduleExecutorUseCase(dynamoDBScheduleRepository, dynamoDBElectronicBillRepository, dynamoDBEntityRepository)

  const schedules = await scheduleExecutorUseCase.run();
  console.log('Obteniendo Schedules', schedules);
}

// Start the cron job
task.start();

console.log('Cron job scheduled to run every day at 2 AM in the timezone America/Bogota');
