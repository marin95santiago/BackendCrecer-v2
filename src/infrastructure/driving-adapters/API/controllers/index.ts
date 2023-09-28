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
import { getItemByCode } from './item/getItemByCode.controller'
import { updateItem } from './item/updateItem.controller'

// Thirds
import { createThird } from './third/createThird.controller'
import { getAllThirds } from './third/getAllThirds.controller'
import { updateThird } from './third/updateThird.controller'
import { getThirdByDocument } from './third/getThirdByDocument.controller'

// Concepts
import { createConcept } from './concept/createConcept.controller'
import { updateConcept } from './concept/updateConcept.controller'
import { getAllConcepts } from './concept/getAllConcepts.controller'
import { getConceptByAccount } from './concept/getConceptByAccount.controller'

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
  getItemByCode as getItemByCodeController,
  updateItem as updateItemController,
  getAllItems as getAllItemsController,
  createThird as createThirdController,
  getAllThirds as getAllThirdsController,
  updateThird as updateThirdController,
  getThirdByDocument as getThirdByDocumentController,
  createConcept as createConceptController,
  updateConcept as updateConceptController,
  getAllConcepts as getAllConceptsController,
  getConceptByAccount as getConceptByAccountController
}
