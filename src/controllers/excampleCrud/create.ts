import { type Response } from 'express'
import { CONSOL, RequestCheker, ResponseData } from '../../utilities'
import { v4 as uuidV4 } from 'uuid'
import { type excampleCrude } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'
import prisma from '../../db'

export const createExcampleCrud = async function (req: any, res: Response): Promise<any> {
  const requestBody = req.body as excampleCrude

  const emptyfield = RequestCheker({
    requireList: ['excmapeName'],
    requestData: requestBody
  })

  if (emptyfield.length > 0) {
    const message = `unable to process request! error( ${emptyfield})`
    const response = ResponseData.error(message)
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }

  try {
    requestBody.id = uuidV4()
    await prisma.excampleCrude.create({
      data: requestBody
    })

    const response = ResponseData.default
    const result = { message: 'success' }
    response.data = result
    return res.status(StatusCodes.CREATED).json(response)
  } catch (error: any) {
    CONSOL.error(error.message)

    const message = `unable to process request! error ${error.message}`
    const response = ResponseData.error(message)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response)
  }
}
