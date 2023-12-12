import { type Response } from 'express'
import { CONSOL, ResponseData } from '../../utilities'
import { StatusCodes } from 'http-status-codes'
import { generateAccesToken, verifyAccesToken } from '../../utilities/jwt'
import { CONFIG } from '../../config'
import prisma from '../../db'

export const refresTokenController = async function (req: any, res: Response): Promise<any> {
  try {
    const requestCookie = req.cookies.refreshtoken

    if (requestCookie === null) {
      const response = ResponseData.error('Missing Authorization.')
      return res.status(StatusCodes.UNAUTHORIZED).json(response)
    }

    const tokenData = verifyAccesToken(requestCookie, CONFIG.secret.secreReferstToken as string)
    if (tokenData == null) {
      const response = ResponseData.error('Missing Authorization.')
      return res.status(StatusCodes.UNAUTHORIZED).json(response)
    }

    const result = await prisma.userAccess.findFirst({
      where: {
        userAccountId: tokenData.id
      }
    })
    if (result === null || result.accessToken !== requestCookie) {
      const response = ResponseData.error('Missing Authorization.')
      return res.status(StatusCodes.UNAUTHORIZED).json(response)
    }

    const newToken = generateAccesToken({
      id: tokenData.id,
      role: tokenData.role
    },
    CONFIG.secret.secretToken as string, '1m')

    const response = ResponseData.default
    response.data = {
      message: 'Token Refresed',
      access_token: newToken
    }
    return res.status(StatusCodes.OK).json(response)
  } catch (error: any) {
    CONSOL.error(error)

    const message = `unable to process request! error ${error.message}`
    const response = ResponseData.error(message)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response)
  }
}
