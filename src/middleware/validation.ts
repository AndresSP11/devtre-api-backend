import { Request, Response,NextFunction } from "express"
import { validationResult } from "express-validator"



export const handleInputErrors=(req:Request,res:Response,next:NextFunction)=>{
    let errors=validationResult(req);

    if(!errors.isEmpty()){
        /* Envio el conjunto de los errores... */
         res.status(400).json({errors:errors.array()})
         
         return
    }
    /* Si todo esta bien pasara a la siguiente validacion correspondiente  */
    next()
}