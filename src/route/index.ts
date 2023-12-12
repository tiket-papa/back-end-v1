/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Express, type Request, type Response } from 'express'
import { excampleCrudeRouter } from './v1/excampleCrudRoute'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../utilities'
import { userRouter } from './v1/userRoute'
import { authRouter } from './v1/authRoute'
export const appRouterv1 = async (app: Express): Promise<any> => {
  app.get(
    '/',
    async (req: Request, res: Response) => {
      const data = {
        message: 'Welcome to Tiket Papa API for more function use /api/v1 as main router'
      }
      const response = ResponseData.default
      response.data = data
      return res.status(StatusCodes.OK).json(response)
    }
  )

  app.get(
    '/api/v1',
    async (req: Request, res: Response) => {
      const data = {
        message: 'Welcome to Tiket Papa API v1'
      }
      const response = ResponseData.default
      response.data = data
      return res.status(StatusCodes.OK).json(response)
    }
  )
  excampleCrudeRouter(app)
  userRouter(app)
  authRouter(app)
}
