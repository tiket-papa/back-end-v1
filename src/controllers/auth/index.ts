import { LoginController } from './login'
import { logoutController } from './logout'
import { emailVerivicationController, requestEmailverificationController } from './mailVerification'
import { refresTokenController } from './refresToken'
import { registerCObtroller } from './register'

export const authController = {
  login: LoginController,
  logout: logoutController,
  refresToken: refresTokenController,
  register: registerCObtroller,
  mailVerification: emailVerivicationController,
  requestEmailverification: requestEmailverificationController
}
