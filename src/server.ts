/* En este caso es la parte de express, osea la inicial */
import express from 'express' 
/* ESCMascript */
import router from './router';
import { connectDB } from './config/db';
import { corsConfig } from './config/cors';
import cors from 'cors'

/* Esta parte se hace funcion del Connect */
connectDB();
const app=express();

//Cors Init
app.use(cors(corsConfig))

/* El valor que permite imprimir el json() */
app.use(express.json())

/* Hace del Router de la 2da Funcion */
app.use('/',router)



export default app