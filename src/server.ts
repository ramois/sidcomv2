import app from './app'
import './services/cronFormint'; 
import './services/cronFormext';
import './services/cronFormcola'; 
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})
//el de arriba es el oficlal
/*import app from './app'
import './services/cronFormint'; 
import './services/cronFormext'; 
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000; // 3000 como valor por defecto
//const PORT = process.env.PORT; // Define un puerto por defecto
//const HOST = '192.168.130.128'; // Define la IP en la que quieres que escuche
const HOST = '192.168.1.15'; // Nueva IP directa
app.listen(PORT, HOST, () => {
    console.log(`Server is running on ${HOST}:${PORT}`);
});*/