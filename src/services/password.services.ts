import bcryptjs from 'bcryptjs';
const SALT_ROUNDS: number=10
export const hashPassword=async(password: string):Promise<string>=>{
    return await bcryptjs.hash(password, SALT_ROUNDS)
}
export const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
    return await bcryptjs.compare(password, hash)
}