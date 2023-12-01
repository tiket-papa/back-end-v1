import { type Response } from 'express'
import { CONSOL, ResponseData } from '../../utilities'
import { StatusCodes } from 'http-status-codes'
import { verifyAccesToken } from '../../utilities/jwt'
import { CONFIG } from '../../config'
import prisma from '../../db'

export const logoutController = async function (req: any, res: Response): Promise<any> {
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
    await prisma.userAccess.delete({
      where: {
        userAccountId: tokenData.id
      }
    })
    res.clearCookie('refreshtoken')
    req.session = null
    const response = ResponseData.default
    return res.status(StatusCodes.OK).json(response)
  } catch (error: any) {
    CONSOL.error(error)
    const message = `unable to process request! error ${error.message}`
    const response = ResponseData.error(message)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response)
  }
}
