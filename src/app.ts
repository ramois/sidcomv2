import dotenv from 'dotenv';
dotenv.config()
//import express from 'express'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes'
import usersRoutes from './routes/userRoutes'
import operatorRoutes from './routes/operatorRoutes'
import sampleRoutes from './routes/sampleRoutes'
import formextRoutes from './routes/formextRoutes'
import formintRoutes from './routes/formintRoutes'
import formintcooperativaRoutes from './routes/formintCooperativaRoutes'
import rolRoutes from './routes/rolRoutes'
import permissionRoutes from './routes/permissionRoutes'
import procedureRoutes from './routes/procedureRoutes'
import municipioRoutes from './routes/municipioRoutes'
import paisRoutes from './routes/paisRoutes'
import aduanaRoutes from './routes/aduanaRoutes'
import departamentoRoutes from './routes/departamentoRoutes'
import presentacionRoutes from './routes/presentacionRoutes'
import mineralRoutes from './routes/mineralRoutes'
import responsbaletmRoutes from './routes/responsabletmRoutes'
import senarecomtmRoutes from './routes/senarecomtmRoutes'
const app = express()
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(express.json())
//Routes
app.use('/auth', authRoutes)
app.use('/user', usersRoutes)
app.use('/operator', operatorRoutes)
app.use('/sample', sampleRoutes)
app.use('/formext', formextRoutes)
app.use('/formint', formintRoutes)
app.use('/formintcooperativa', formintcooperativaRoutes)
app.use('/roles', rolRoutes)
app.use('/permisos', permissionRoutes)
app.use('/procedimiento', procedureRoutes)
app.use('/municipio', municipioRoutes)
app.use('/departamento', departamentoRoutes)
app.use('/presentacion', presentacionRoutes)
app.use('/mineral', mineralRoutes)
app.use('/pais', paisRoutes)
app.use('/aduana', aduanaRoutes)
app.use('/responsabletm', responsbaletmRoutes)
app.use('/senarecomtm', senarecomtmRoutes)
console.log('esto esta siendo ejecutado')
export default app
