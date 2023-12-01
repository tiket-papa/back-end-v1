import { type UsersAccount } from '@prisma/client'
import { type Response } from 'express'
import { CONSOL, RequestCheker, ResponseData } from '../../utilities'
import { StatusCodes } from 'http-status-codes'
import prisma from '../../db'

export const removeUser = async function (req: any, res: Response): Promise<any> {
  const requestBody = req.params as UsersAccount
  const emptyfield = RequestCheker({
    requireList: ['id'],
    requestData: requestBody
  })
  if (emptyfield.length > 0) {
    const message = `unable to process request! error( ${emptyfield})`
    const response = ResponseData.error(message)
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }

  try {
    const result = await prisma.usersAccount.findUnique({
      where: {
        deleted: 0,
        id: requestBody.id
      }
    })

    if (result == null) {
      const message = { message: `data with id = ${requestBody.id} not found` }
      const response = ResponseData.error(message)
      return res.status(StatusCodes.NOT_FOUND).json(response)
    }

    await prisma.usersAccount.update({
      where: {
        id: requestBody.id
      },
      data: {
        deleted: 1
      }
    })

    const response = ResponseData.default
    response.data = { message: 'success' }
    return res.status(StatusCodes.OK).json(response)
  } catch (error: any) {
    CONSOL.error(error)

    const message = `unable to process request! error ${error.message}`
    const response = ResponseData.error(message)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response)
  }
}
