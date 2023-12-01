/* eslint-disable @typescript-eslint/explicit-function-return-type */
import multer from 'multer'
import path from 'path'
export const fileUpaloadHendeler = function (destinationFolder: string) {
  const storge = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destinationFolder)
    },
    filename: function (req, file, cb) {
      const unicSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      cb(null, file.fieldname + '-' + unicSuffix + path.extname(file.originalname))
    }
  })

  return multer({
    storage: storge
  })
}
