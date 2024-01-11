import { type Response } from 'express'
import { CONSOL, Pagination, RequestCheker, ResponseData } from '../../utilities'
import { StatusCodes } from 'http-status-codes'
import prisma from '../../db'
import { type Wisata } from '@prisma/client'

export const findAllWisata = async function (req: any, res: Response): Promise<any> {
  const page = new Pagination(
    (req.query.page === undefined) ? 0 : parseInt(req.query.page),
    (req.query.size === undefined) ? 10 : parseInt(req.query.size)
  )
  try {
    const rows = await prisma.wisata.findMany({
      where: {
        deleted: { equals: 0 },
        ...(Boolean(req.query.search) && {
          OR: [
            {
              name: {
                contains: req.query.search
              },
              Location: {
                contains: req.query.search
              }
            }
          ]
        })
      },
      include: {
        Images: {
          take: 1
        },
        Ulasan: true
      },
      skip: page.offset,
      take: page.limit,
      orderBy: {
        name: 'asc'
      }
    })

    const count = await prisma.wisata.count({
      where: {
        deleted: { equals: 0 },
        ...(Boolean(req.query.search) && {
          OR: [
            {
              name: {
                contains: req.query.search
              },
              Location: {
                contains: req.query.search
              }
            }
          ]
        })
      },
      orderBy: {
        name: 'asc'
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

export const findOneByWisataId = async function (req: any, res: Response): Promise<any> {
  const requestParam = req.params as Wisata

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
    const result = await prisma.wisata.findUnique({
      where: {
        id: requestParam.id
      },
      include: {
        Images: true,
        Fasilitias: true,
        PublicFasilitias: true,
        Ulasan: {
          include: {
            ImagesUlasan: true,
            Users: true
          }
        }
      }
    })
    if (result === null) {
      const message = { message: `data with email = ${requestParam.id} not found` }
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

export const findWisAllataByType = async function (req: any, res: Response): Promise<any> {
  const requestParam = req.params

  const emptyfield = RequestCheker({
    requireList: ['type'],
    requestData: requestParam
  })

  if (emptyfield.length > 0) {
    const message = `unable to process request! error( ${emptyfield})`
    const response = ResponseData.error(message)
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }

  const page = new Pagination(
    (req.query.page === undefined) ? 0 : parseInt(req.query.page),
    (req.query.size === undefined) ? 10 : parseInt(req.query.size)
  )

  try {
    const rows = await prisma.wisata.findMany({
      where: {
        deleted: { equals: 0 },
        typeWisata: requestParam.type
      },
      include: {
        Images: {
          take: 1
        }
      },
      skip: page.offset,
      take: page.limit,
      orderBy: {
        name: 'asc'
      }
    })
    const count = await prisma.wisata.count({
      where: {
        deleted: { equals: 0 },
        typeWisata: requestParam.type
      },
      orderBy: {
        name: 'asc'
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
