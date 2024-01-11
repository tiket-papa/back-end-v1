import { type Response } from 'express'
import { CONSOL, RequestCheker, ResponseData } from '../../utilities'
import { v4 as uuidV4 } from 'uuid'
import { StatusCodes } from 'http-status-codes'
import { type UsersAccount } from '@prisma/client'
import { passwordHasher } from '../../utilities/passwordHendler'
import prisma from '../../db'

export const createUser = async function (req: any, res: Response): Promise<any> {
  const requestBody = req.body as UsersAccount

  const emptyfield = RequestCheker({
    requireList: ['email', 'password'],
    requestData: requestBody
  })

  if (emptyfield.length > 0) {
    const message = `unable to process request! error( ${emptyfield})`
    const response = ResponseData.error(message)
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
  try {
    requestBody.id = uuidV4()
    requestBody.password = await passwordHasher(requestBody.password)
    await prisma.usersAccount.create({
      data: requestBody
    })
    await prisma.userData.create({
      data: {
        userAccountId: requestBody.id
      }
    })
    const response = ResponseData.default
    response.data = { message: 'success' }
    return res.status(StatusCodes.CREATED).json(response)
  } catch (error: any) {
    CONSOL.error(error)
    const message = `unable to process request! error ${error.message}`
    const response = ResponseData.error(message)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response)
  }
}
