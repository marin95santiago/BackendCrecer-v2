import { createUser } from './user/createUser.controller'
import { getAllUsers } from './user/getAllUsers.controller'
import { getUserById } from './user/getUserById.controller'
import { updateUser } from './user/updateUser.controller'
import { deleteUser } from './user/deleteUser.controller'

// Entities
import { createEntity } from './entity/createEntity.controller'

// Login controller
import { login } from './login/login.controller'

// Bill
import { createElectronicBill } from './bill/createElectronicBill.controller'

// Items
import { createItem } from './item/createItem.controller'
import { getAllItems } from './item/getAllItems.controller'

// Thirds
import { createThird } from './third/createThird.controller'
import { getAllThirds } from './third/getAllThirds.controller'

export {
  createUser as createUserController,
  getAllUsers as getAllUsersController,
  getUserById as getUserByIdController,
  updateUser as updateUserController,
  deleteUser as deleteUserController,
  createEntity as createEntityController,
  login as loginController,
  createElectronicBill as createElectronicBillController,
  createItem as createItemController,
  getAllItems as getAllItemsController,
  createThird as createThirdController,
  getAllThirds as getAllThirdsController
}
