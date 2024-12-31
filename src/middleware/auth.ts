/* Esto va ser para proger el endpoinnt o las rutas que nosotros mandaremos que no seran visitadas si no se encuentra el usuario activo */
import {Request,Response,NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import User, { TUser } from '../models/User';

/* Declara global para que el req se vea y se tome alli */
declare global{
    namespace Express{
        interface Request{
            user ?: TUser
        }
    }
}

export const authenticate=async(req:Request,res:Response,next:NextFunction)=>{
    const bearer=req.headers.authorization;
    
    /* Consultando la data de authorization */
    /* Cuando no se envia nada el undefined toma como un false */
    if(!bearer){
        const error=new Error('No autorizado')
        res.status(401).json({error:error.message})
        return
    }
    /* De aqui se obtiene el JWToken */
    const variable=bearer.split(' ');
    const token=variable[1];

    if(!token){
        const error=new Error('No autorizado')
        res.status(401).json({error:error.message})
        return
    }

    try {
        /* En este caso la parte de verify tienes la parte de obtener la data p[orque tiene una clave secreta.] */
        const result=jwt.verify(token,process.env.JWT_SECRET)
        /* console.log(result);  imprime el objeto de Json Web Token */
        if(typeof result==='object' && result.id){
            console.log(result.id);
            const user=await User.findById(result.id).select('-password');
            
            if(!user){
                const error=new Error('Usuario no Encontrado')
                res.status(404).json({error:error.message})
                return
            }
            req.user=user;
            next()
        }


    } catch (error) {
        res.status(500).json({error:'Token No Valido'})
    }

}