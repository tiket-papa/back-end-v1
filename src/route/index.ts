/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Express, type Request, type Response } from 'express'
import { excampleCrudeRouter } from './v1/excampleCrudRoute'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../utilities'
export const appRouterv1 = async (app: Express): Promise<any> => {
  app.get(
    '/api/v1',
    async (req: Request, res: Response) => {
      try {
        const data = {
          message: 'Welcome to Tiket Papa API v1'
        }
        const response = ResponseData.default
        response.data = data
        return res.status(StatusCodes.OK).json(response)
      } catch (error: any) {
        console.error(error.message)

        const message = `unable to process request! error ${error.message}`
        const response = ResponseData.error(message)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response)
      }
    }
  )
  excampleCrudeRouter(app)
}
