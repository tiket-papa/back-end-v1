import { type Response } from 'express'
import { CONSOL, RequestCheker, ResponseData } from '../../utilities'
import { StatusCodes } from 'http-status-codes'
import { type UsersAccount } from '@prisma/client'
import { v4 as uuidV4 } from 'uuid'
import { passwordHasher } from '../../utilities/passwordHendler'
import prisma from '../../db'
import { generateAccesTokenjustid } from '../../utilities/jwt'
import { CONFIG } from '../../config'
import { verifyEmailTemplate } from '../../templates'
import MailSevice from '../../services/mailService'

export const registerCObtroller = async function (req: any, res: Response): Promise<any> {
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
    const emailCehker = await prisma.usersAccount.findFirst({
      where: {
        email: requestBody.email
      },
      select: {
        email: true
      }
    })

    if (emailCehker !== null) {
      const message = 'email already exists'
      const response = ResponseData.error(message)
      return res.status(StatusCodes.BAD_REQUEST).json(response)
    }
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
    const token = generateAccesTokenjustid(requestBody.id, CONFIG.secret.secretEmailVerivcation as string, '1d')

    const link = `${CONFIG.TargetURL}:${CONFIG.port}/api/v1/auth/verify?q=${token}`

    const emailVerivication = verifyEmailTemplate(link)

    const mailService = MailSevice.getInstance()
    void mailService.sendMail(requestBody.id, {
      from: CONFIG.smtp.sender,
      to: requestBody.email,
      subject: 'Email Verification',
      text: emailVerivication.text,
      html: emailVerivication.html
    })

    const response = ResponseData.default
    response.data = { message: 'account has been successfully created, please cek your email', link }
    return res.status(StatusCodes.OK).json(response)
  } catch (error: any) {
    CONSOL.error(error)
    const message = `unable to process request! error ${error.message}`
    const response = ResponseData.error(message)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response)
  }
}
