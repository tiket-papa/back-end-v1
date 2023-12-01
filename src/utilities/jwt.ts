import jwt from 'jsonwebtoken'

export interface jwtPayloadInterface {
  id: string
  role: string | undefined
}

export const generateAccesToken = function (account: jwtPayloadInterface, secretToken: string, expiresIn: string): string {
  return jwt.sign(account, secretToken, { expiresIn })
}

export const verifyAccesToken = function (token: string, secretToken: string): jwtPayloadInterface | null {
  try {
    return jwt.verify(token, secretToken) as jwtPayloadInterface
  } catch (error: any) {
    return null
  }
}
