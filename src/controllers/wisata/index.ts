import { findAllWisata, findOneByWisataId, findWisAllataByType } from './find'

export const wisataController = {
  find: findAllWisata,
  findOne: findOneByWisataId,
  findBytyp: findWisAllataByType
}
