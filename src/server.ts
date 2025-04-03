import app from './app'
import './services/cronFormint'; 
import './services/cronFormext';
import './services/cronFormcola'; 
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})

