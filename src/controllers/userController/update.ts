import { type UserData, type UsersAccount } from '@prisma/client'
import { type Response } from 'express'
import { CONSOL, RequestCheker, ResponseData } from '../../utilities'
import { StatusCodes } from 'http-status-codes'
import prisma from '../../db'
import { passwordHasher } from '../../utilities/passwordHendler'

export const updateUserAcunt = async function (req: any, res: Response): Promise<any> {
  const requestBody = req.body as UsersAccount

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

    requestBody.updatedAt = new Date()
    await prisma.usersAccount.update({
      where: {
        id: requestBody.id
      },
      data: {
        ...(requestBody.username !== null && {
          username: requestBody.username
        }),
        ...(requestBody.password.length > 0 && {
          password: await passwordHasher(requestBody.password)
        })
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

export const updateUserData = async function (req: any, res: Response): Promise<any> {
  const requestBody = req.body as UserData

  const emptyfield = RequestCheker({
    requireList: ['userAccountId'],
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
        id: requestBody.userAccountId
      }
    })

    if (result == null) {
      const message = { message: `data with id = ${requestBody.userAccountId} not found` }
      const response = ResponseData.error(message)
      return res.status(StatusCodes.NOT_FOUND).json(response)
    }

    await prisma.userData.update({
      where: {
        userAccountId: requestBody.userAccountId
      },
      data: {
        ...(requestBody.profile !== null && {
          profile: requestBody.profile
        })
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
