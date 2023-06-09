import { createUser } from './user/createUser.controller'
import { getAllUsers } from './user/getAllUsers.controller'
import { getUserById } from './user/getUserById.controller'
import { updateUser } from './user/updateUser.controller'
import { deleteUser } from './user/deleteUser.controller'

// Entities
import { createEntity } from './entity/createEntity.controller'
import { getAllEntities } from './entity/getAllEntities.controller'
import { getEntityById } from './entity/getEntityById.controller'

// Login controller
import { login } from './login/login.controller'

// Bill
import { createElectronicBill } from './bill/createElectronicBill.controller'
import { getAllElectronicBills } from './bill/getAllElectronicBills.controller'
import { getElectronicBillByNumber } from './bill/getElectronicBillByNumber.controller'

// Items
import { createItem } from './item/createItem.controller'
import { getAllItems } from './item/getAllItems.controller'

// Thirds
import { createThird } from './third/createThird.controller'
import { getAllThirds } from './third/getAllThirds.controller'
import { updateThird } from './third/updateThird.controller'
import { getThirdByDocument } from './third/getThirdByDocument.controller'

export {
  createUser as createUserController,
  getAllUsers as getAllUsersController,
  getUserById as getUserByIdController,
  updateUser as updateUserController,
  deleteUser as deleteUserController,
  createEntity as createEntityController,
  getAllEntities as getAllEntitiesController,
  getEntityById as getEntityByIdController,
  login as loginController,
  createElectronicBill as createElectronicBillController,
  getAllElectronicBills as getAllElectronicBillsController,
  getElectronicBillByNumber as getElectronicBillByNumberController,
  createItem as createItemController,
  getAllItems as getAllItemsController,
  createThird as createThirdController,
  getAllThirds as getAllThirdsController,
  updateThird as updateThirdController,
  getThirdByDocument as getThirdByDocumentController
}
