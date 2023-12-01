import { type UsersAccount } from '@prisma/client'
import { type Response } from 'express'
import { CONSOL, RequestCheker, ResponseData } from '../../utilities'
import { StatusCodes } from 'http-status-codes'
import prisma from '../../db'
import { comparePassword } from '../../utilities/passwordHendler'
import { generateAccesToken } from '../../utilities/jwt'
import { CONFIG } from '../../config'

export const LoginController = async function (req: any, res: Response): Promise<any> {
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
    const result = await prisma.usersAccount.findFirst({
      where: {
        deleted: 0,
        email: requestBody.email
      },
      include: {
        userAccess: true
      }
    })
    if (result === null) {
      const message = { message: `data with email = ${requestBody.email} not found` }
      const response = ResponseData.error(message)
      return res.status(StatusCodes.NOT_FOUND).json(response)
    }

    if (result.VerifiedEmail === 0) {
      const message = `Email ${requestBody.VerifiedEmail} not not yet verified, Please check your email !`
      const response = ResponseData.error(message)
      return res.status(StatusCodes.UNAUTHORIZED).json(response)
    }

    if (!await comparePassword(requestBody.password, result.password)) {
      const message = 'Incorrect password, Please check again !'
      const response = ResponseData.error(message)
      return res.status(StatusCodes.UNAUTHORIZED).json(response)
    }

    const token = generateAccesToken({
      id: result.id,
      role: result.role
    },
    CONFIG.secret.secretToken as string, '1m')

    const refresToken = generateAccesToken({
      id: result.id,
      role: result.role
    },
    CONFIG.secret.secreReferstToken as string, '1w')

    res.cookie('refreshtoken', refresToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    await prisma.userAccess.create({
      data: {
        userAccountId: result.id,
        accessToken: refresToken
      }
    })

    const response = ResponseData.default
    response.data = {
      message: 'login success',
      accessToken: token
    }
    return res.status(StatusCodes.OK).json(response)
  } catch (error: any) {
    CONSOL.error(error)

    const message = `unable to process request! error ${error.message}`
    const response = ResponseData.error(message)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response)
  }
}
