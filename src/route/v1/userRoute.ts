/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import express, { type Express, type Request, type Response } from 'express'
import { userController } from '../../controllers'

export const userRouter = (app: Express) => {
  const router = express.Router()
  app.use('/api/v1/user', router)

  router.get(
    '/',
    async (req: Request, res: Response) => await userController.findAll(req, res)
  )

  router.get(
    '/:id',
    async (req: Request, res: Response) => await userController.findById(req, res)
  )

  router.get(
    '/email',
    async (req: Request, res: Response) => await userController.findByEmail(req, res)
  )

  router.post(
    '/',
    async (req: Request, res: Response) => await userController.create(req, res)
  )

  router.put(
    '/',
    async (req: Request, res: Response) => await userController.updateAccount(req, res)
  )

  router.put(
    '/data',
    async (req: Request, res: Response) => await userController.updateData(req, res)
  )
}
