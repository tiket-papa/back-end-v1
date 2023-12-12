import { LoginController } from './login'
import { logoutController } from './logout'
import { refresTokenController } from './refresToken'
import { registerCObtroller } from './register'

export const authController = {
  login: LoginController,
  logout: logoutController,
  refresToken: refresTokenController,
  register: registerCObtroller
}
