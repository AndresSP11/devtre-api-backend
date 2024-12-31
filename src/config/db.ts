import colors from 'colors'
import mongoose from "mongoose";
/* Exporta aqui, no se manda la variable globla hacia el server */
import 'dotenv/config'

export const connectDB=async()=>{
    try {
        
        const {connection}=await mongoose.connect(process.env.MONGO_URI)
        const url2=`${connection.host}:${connection.port}`
        console.log((`MongoDB Conectado es en ${url2}`));
    } catch (error) {
        console.log(colors.bgRed.magenta(error.message));
        process.exit(1)
    }
}