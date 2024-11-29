import dotenv from 'dotenv';
dotenv.config()
//import express from 'express'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes'
import usersRoutes from './routes/userRoutes'
import operatorRoutes from './routes/operatorRoutes';
import sampleRoutes from './routes/sampleRoutes'
import formextRoutes from './routes/formextRoutes'
import formintRoutes from './routes/formintRoutes'
import rolRoutes from './routes/rolRoutes'
import municipioRoutes from './routes/municipioRoutes'
import departamentoRoutes from './routes/departamentoRoutes'
import presentacionRoutes from './routes/presentacionRoutes'
import mineralRoutes from './routes/mineralRoutes'
const app = express()
app.use(cors()); // Utiliza cors
app.use(express.json())
//Routes
app.use('/auth', authRoutes)
app.use('/user', usersRoutes)
app.use('/operator', operatorRoutes)
app.use('/sample', sampleRoutes)
app.use('/formext', formextRoutes)
app.use('/formint', formintRoutes)
app.use('/roles', rolRoutes)
app.use('/municipio', municipioRoutes)
app.use('/departamento', departamentoRoutes)
app.use('/presentacion', presentacionRoutes)
app.use('/mineral', mineralRoutes)
//autenticacion
//user
console.log('esto esta siendo ejecutado')
export default app
