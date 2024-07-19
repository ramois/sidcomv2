import dotenv from 'dotenv';
dotenv.config()
import express from 'express'
import authRoutes from './routes/authRoutes'
import usersRoutes from './routes/userRoutes'
import operatorRoutes from './routes/operatorRoutes';
const app = express()
app.use(express.json())
//Routes
app.use('/auth', authRoutes)
app.use('/user', usersRoutes)
app.use('/operator', operatorRoutes)
//autenticacion
//user
console.log('esto esta siendo ejecutado')
export default app
