import { type Response } from 'express'
import { CONSOL, RequestCheker, ResponseData } from '../../utilities'
import { StatusCodes } from 'http-status-codes'
import { generateAccesTokenjustid, verifyAccesToken } from '../../utilities/jwt'
import { CONFIG } from '../../config'
import prisma from '../../db'
import { verifyEmailTemplate } from '../../templates'
import MailSevice from '../../services/mailService'

export const emailVerivicationController = async function (req: any, res: Response): Promise<any> {
  const requestQuery = req.query

  const emptyfield = RequestCheker({
    requireList: ['q'],
    requestData: requestQuery
  })

  if (emptyfield.length > 0) {
    const message = `unable to process request! error( ${emptyfield})`
    const response = ResponseData.error(message)
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }

  try {
    const result = verifyAccesToken(requestQuery.q, CONFIG.secret.secretEmailVerivcation as string)
    if (result === null) {
      const message = 'invalid token'
      const response = ResponseData.error(message)
      return res.status(StatusCodes.UNAUTHORIZED).json(response)
    }

    const userAccount = await prisma.usersAccount.findFirst({
      where: {
        id: result.id
      }
    })

    if (userAccount === null) {
      const response = ResponseData.error('Missing Authorization.')
      return res.status(StatusCodes.UNAUTHORIZED).json(response)
    }

    if (userAccount.VerifiedEmail !== 1) {
      const response = ResponseData.error('Email already verified.')
      return res.status(StatusCodes.UNAUTHORIZED).json(response)
    }

    await prisma.usersAccount.update({
      where: {
        id: userAccount.id
      },
      data: {
        VerifiedEmail: 1
      }
    })

    const response = ResponseData.default
    response.data = { message: 'email has been successfully verified' }
    return res.status(StatusCodes.OK).json(response)
  } catch (error: any) {
    CONSOL.error(error)

    const message = `unable to process request! error ${error.message}`
    const response = ResponseData.error(message)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response)
  }
}

export const requestEmailverificationController = async function (req: any, res: Response): Promise<any> {
  const requestQuery = req.query

  const emptyfield = RequestCheker({
    requireList: ['email'],
    requestData: requestQuery
  })
  if (emptyfield.length > 0) {
    const message = `unable to process request! error( ${emptyfield})`
    const response = ResponseData.error(message)
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }

  try {
    const userAccount = await prisma.usersAccount.findFirst({
      where: {
        deleted: 0,
        email: requestQuery.email
      }
    })

    if (userAccount === null) {
      const response = ResponseData.error('email not found, please register first !!')
      return res.status(StatusCodes.NOT_FOUND).json(response)
    }

    const token = generateAccesTokenjustid(userAccount.id, CONFIG.secret.secretEmailVerivcation as string, '1d')

    const link = `${CONFIG.appURL}:${CONFIG.port}/api/v1/auth/verify?q=${token}`

    const emailVerivication = verifyEmailTemplate(link)

    const mailService = MailSevice.getInstance()
    void mailService.sendMail(userAccount.id, {
      from: CONFIG.smtp.sender,
      to: userAccount.email,
      subject: 'Email Verification',
      text: emailVerivication.text,
      html: emailVerivication.html
    })

    const response = ResponseData.default
    response.data = { message: 'email has been successfully sent, please cek your email', link }
    return res.status(StatusCodes.OK).json(response)
  } catch (error: any) {
    CONSOL.error(error)

    const message = `unable to process request! error ${error.message}`
    const response = ResponseData.error(message)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response)
  }
}
