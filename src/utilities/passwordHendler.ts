/* eslint-disable @typescript-eslint/return-await */
import bcrypt from 'bcrypt'

export const passwordHasher = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

export const comparePassword = async (password: string, hashPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashPassword)
}
