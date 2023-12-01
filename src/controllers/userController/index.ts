import { createUser } from './create'
import { findAllUser, findUserById, findUserByUserEmail } from './find'
import { hardRemoveUser, removeUser } from './remove'
import { updateUserAcunt, updateUserData } from './update'

export const userController = {
  findAll: findAllUser,
  findById: findUserById,
  findByEmail: findUserByUserEmail,
  create: createUser,
  updateAccount: updateUserAcunt,
  updateData: updateUserData,
  remove: removeUser,
  hardRemove: hardRemoveUser
}
