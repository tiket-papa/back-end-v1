import { LoginController } from './login'
import { logoutController } from './logout'

export const authController = {
  login: LoginController,
  logout: logoutController
}
