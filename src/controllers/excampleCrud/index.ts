import { createExcampleCrud } from './create'
import { findCurdExcample, findCurdExcampleById } from './find'
import { hardRemoveExcampleCrud, removeExcampleCrud } from './remove'
import { updateExcampleCrud } from './update'

export const excampleCrudeController = {
  findAll: findCurdExcample,
  findOneById: findCurdExcampleById,
  create: createExcampleCrud,
  update: updateExcampleCrud,
  remove: removeExcampleCrud,
  hardRemove: hardRemoveExcampleCrud
}
