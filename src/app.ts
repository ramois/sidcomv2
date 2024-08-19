import dotenv from 'dotenv';
dotenv.config()
import express from 'express'
import authRoutes from './routes/authRoutes'
import usersRoutes from './routes/userRoutes'
import operatorRoutes from './routes/operatorRoutes';
import sampleRoutes from './routes/sampleRoutes'
import formextRoutes from './routes/formextRoutes'
import formintRoutes from './routes/formintRoutes'
const app = express()
app.use(express.json())
//Routes
app.use('/auth', authRoutes)
app.use('/user', usersRoutes)
app.use('/operator', operatorRoutes)
app.use('/sample', sampleRoutes)
app.use('/formext', formextRoutes)
app.use('/formint', formintRoutes)
//autenticacion
//user
console.log('esto esta siendo ejecutado')
export default app
