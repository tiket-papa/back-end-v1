import { type Response } from 'express'
import { CONSOL, Pagination, RequestCheker, ResponseData } from '../../utilities'
import { StatusCodes } from 'http-status-codes'
import prisma from '../../db'
import { type UsersAccount } from '@prisma/client'

export const findAllUser = async function (req: any, res: Response): Promise<any> {
  try {
    const page = new Pagination(
      (req.query.page === undefined) ? 0 : parseInt(req.query.page),
      (req.query.size === undefined) ? 10 : parseInt(req.query.size)
    )

    const rows = await prisma.usersAccount.findMany({
      where: {
        deleted: { equals: 0 },
        ...(Boolean(req.query.search) && {
          OR: [
            {
              username: {
                contains: req.query.search
              }
            }
          ]
        })
      },
      include: {
        userData: true
      },
      skip: page.offset,
      take: page.limit,
      orderBy: {
        id: 'desc'
      }
    })

    const count = await prisma.usersAccount.count({
      where: {
        deleted: { equals: 0 },
        ...(Boolean(req.query.search) && {
          OR: [
            {
              username: {
                contains: req.query.search
              }
            }
          ]
        })
      },
      orderBy: {
        id: 'desc'
      }
    })

    const response = ResponseData.default
    response.data = page.data({ count, rows })
    return res.status(StatusCodes.OK).json(response)
  } catch (error: any) {
    CONSOL.error(error)
    const message = `unable to process request! error ${error.message}`
    const response = ResponseData.error(message)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response)
  }
}

export const findUserById = async function (req: any, res: Response): Promise<any> {
  const requestParam = req.params as UsersAccount

  const emptyfield = RequestCheker({
    requireList: ['id'],
    requestData: requestParam
  })

  if (emptyfield.length > 0) {
    const message = `unable to process request! error( ${emptyfield})`
    const response = ResponseData.error(message)
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }

  try {
    const result = await prisma.usersAccount.findUnique({
      where: {
        id: requestParam.id
      },
      include: {
        userData: true
      }
    })

    if (result === null) {
      const message = { message: `data with id = ${requestParam.id} not found` }
      const response = ResponseData.error(message)
      return res.status(StatusCodes.NOT_FOUND).json(response)
    }

    const response = ResponseData.default
    response.data = result
    return res.status(StatusCodes.OK).json(response)
  } catch (error: any) {
    CONSOL.error(error)
    const message = `unable to process request! error ${error.message}`
    const response = ResponseData.error(message)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response)
  }
}

export const findUserByUserEmail = async function (req: any, res: Response): Promise<any> {
  const requestQuery = req.query as UsersAccount

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
    const result = await prisma.usersAccount.findUnique({
      where: {
        email: requestQuery.email
      },
      include: {
        userData: true
      }
    })

    if (result === null) {
      const message = { message: `data with email = ${requestQuery.email} not found` }
      const response = ResponseData.error(message)
      return res.status(StatusCodes.NOT_FOUND).json(response)
    }

    const response = ResponseData.default
    response.data = result
    return res.status(StatusCodes.OK).json(response)
  } catch (error: any) {
    CONSOL.error(error)
    const message = `unable to process request! error ${error.message}`
    const response = ResponseData.error(message)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response)
  }
}
