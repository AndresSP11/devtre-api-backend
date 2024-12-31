import { white } from "colors";
import { CorsOptions } from "cors";


export const corsConfig:CorsOptions={
    origin: function(origin,callback){
        const whiteList=[process.env.FRONTEND_URL]
        
        
        if(process.argv[2]==='--api'){
            /* Esto se hace ocn el fin de poder ejecutar las apis con las herramientas
            como thunderCliente debido a que se esta brindando autorizacion a las APIS que haran dicha solicitud unicamente po
            tema de seguridad */
            whiteList.push(undefined);
            
        }

        if(whiteList.includes(origin)){
            callback(null,true)
        }else{
            callback(new Error('Error de CORS'))
        }
    }
}