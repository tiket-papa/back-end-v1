import { type Request, type Response, type NextFunction } from 'express'
import { CONFIG } from '../config'
import { CONSOL, ResponseData } from '../utilities'
import { StatusCodes } from 'http-status-codes'

export const cekFileSize = async function (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    if (req.file == null) {
      const message = 'file not found'
      const response = ResponseData.error(message)
      return res.status(StatusCodes.BAD_REQUEST).json(response)
    }
    const fileSize = req.file.size / 1024
    console.log(fileSize)
    if (fileSize > +CONFIG.maximumUploadFile) {
      const message = 'maksimal upload file adalah ' + +CONFIG.maximumUploadFile / 1024 + 'mb'
      throw new Error(message)
    }

    next()
  } catch (error: any) {
    CONSOL.error(error)

    const message = 'maksimal upload file adalah ' + +CONFIG.maximumUploadFile / 1024 + 'mb'
    const response = ResponseData.error(message)
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}
