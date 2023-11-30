/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import express, { type Express, type Request, type Response } from 'express'
import { excampleCrudeController } from '../../controllers'

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

  router.post(
    '/',
    async (req: Request, res: Response) => await excampleCrudeController.create(req, res)
  )

  router.put(
    '/',
    async (req: Request, res: Response) => await excampleCrudeController.update(req, res)
  )

  router.delete(
    '/',
    async (req: Request, res: Response) => await excampleCrudeController.remove(req, res)
  )

  router.delete(
    '/hard/',
    async (req: Request, res: Response) => await excampleCrudeController.hardRemove(req, res)
  )
}
