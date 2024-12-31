/* El nombre de server se importa desde app, pero lo hace solo el nombre, de ahi no cambia... */
import server from "./server";
import colors from 'colors';

const port=process.env.PORT || 4000;

server.listen(port,()=>{
    console.log(colors.bgBlue.magenta.italic('Servidor Funcionando en el puerto..'),`http:localhost:${port}`);
})  

