import bcryptjs from 'bcryptjs';
const SALT_ROUNDS: number=10
export const hashPassword = async (password: string): Promise<string> => {
    try {
        return await bcryptjs.hash(password, SALT_ROUNDS);
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Error al hashear la contraseña');
    }
};
export const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
    try {
        return await bcryptjs.compare(password, hash);
    } catch (error) {
        console.error('Error comparing passwords:', error);
        throw new Error('Error al comparar las contraseñas');
    }
};