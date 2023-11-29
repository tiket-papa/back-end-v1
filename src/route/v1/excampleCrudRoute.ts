/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import express, { type Express, type Request, type Response } from 'express'
import { excampleCrudeController } from '../../controllers/excampleCrud'

export const excampleCrudeRouter = (app: Express) => {
  const router = express.Router()
  app.use('/api/v1/excamplecrud', router)

  router.get(
    '/',
    async (req: Request, res: Response) => await excampleCrudeController.findAll(req, res)
  )

  router.get(
    '/:id',
    async (req: Request, res: Response) => await excampleCrudeController.findOneById(req, res)
  )
}
