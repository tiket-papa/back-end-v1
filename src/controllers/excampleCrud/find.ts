import { type Response } from 'express'
import { CONSOL, Pagination, RequestCheker, ResponseData } from '../../utilities'
import { StatusCodes } from 'http-status-codes'
import prisma from '../../db'
import { type excampleCrude } from '@prisma/client'

export const findCurdExcample = async function (req: any, res: Response): Promise<any> {
  try {
    const page = new Pagination(
      (req.query.page === undefined) ? 0 : parseInt(req.query.page),
      (req.query.size === undefined) ? 10 : parseInt(req.query.size)
    )

    const rows = await prisma.excampleCrude.findMany({
      where: {
        deleted: { equals: 0 },
        ...(Boolean(req.query.search) && {
          OR: [
            {
              excmapeName: {
                contains: req.query.search
              }
            }
          ]
        })
      },
      skip: page.offset,
      take: page.limit,
      orderBy: {
        id: 'desc'
      }
    })
    const count = await prisma.excampleCrude.count({
      where: {
        deleted: { equals: 0 },
        ...(Boolean(req.query.search) && {
          OR: [
            {
              excmapeName: {
                contains: req.query.search
              }
            }
          ]
        })
      },
      skip: page.offset,
      take: page.limit,
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

export const findCurdExcampleById = async function (req: any, res: Response): Promise<any> {
  const requestParam = req.params as excampleCrude

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
    const result = await prisma.excampleCrude.findUnique({
      where: {
        id: requestParam.id
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
