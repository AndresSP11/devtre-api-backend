import User from "../models/User";
import type { Request,Response } from "express"; 
import { validationResult } from "express-validator";
import slugify from "slugify";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import {v4 as uuid} from 'uuid'
import slug from "slug";


/* En este caso para la expresio de Request y Response... */
export const createAccount=async (req:Request,res:Response)=>{

    
    /* Destructugring Objeect */
    const {email,password}=req.body;

    const userExist=await User.findOne({email});

    if(userExist){
        const error = new Error('Un usuario ya ocupa este email');
        res.status(409).json({error:error.message});
        return
    }
    /* Slugify convierte en minuscula y los espacio reemplaza en campo vacio */
    const handle=slugify(req.body.handle,{lower:true,replacement:''});
    const userHandle=await User.findOne({handle});

    if(userHandle){
        const error = new Error('Existe el Handle ');
        res.status(409).json({error:error.message});
        return
    }
    
    const user=new User(req.body);
    /* Que cargue todo el proceso de la funcion 
    en este caso va hashear el password*/
    user.password=await hashPassword(password);
    user.handle=handle;
    console.log(slugify(handle,{
        lower:true,
        replacement: ''
    }));
    
    await user.save();

   /* await User.create(req.body); */
   res.status(201).send("Enviado Correctamente el Usuario");
   return
}

export const login = async(req:Request,res:Response)=>{
    /* console.log('Desde Login'); */
    /* Parte inicial  */
    /* Validacion de los errores */
   
    

    const {email,password}=req.body;
    /* Revisar si el usuario esta registrado */
    const user=await User.findOne({email});
    /* Si es que no encuentra , */
    if(!user){
        const error=new Error('El usuario no existe')
        res.status(404).json({error:error.message})
        return
    }
    //Comprobar que el password es correcto
    const isPasswordCorrect=await checkPassword(password,user.password);
    if(!isPasswordCorrect){
        const error=new Error('El password o email ingresado es incorrecto')
        res.status(401).json({error:error.message})
        return
    }

    const token=generateJWT({id:user._id})
    /* Si todo esat okey, mandamos como respuesta la parte del Token */
    res.send(token);

}

export const getUser=async(req:Request,res:Response)=>{
    /* Esta es de la parte global */
    res.json(req.user)

}

export const updateProfile=async(req:Request,res:Response)=>{
    try {
        
        const {description,links}=req.body                  
        const handle=slugify(req.body.handle,{lower:true,replacement:''});
        const userHandle=await User.findOne({handle});

    if(userHandle && userHandle.email!==req.user.email){
        const error = new Error('Existe el Handle ');
        res.status(409).json({error:error.message});
        return
    }

    req.user.description=description;
    req.user.handle=handle;
    req.user.links=links
    await req.user.save();
    res.send('Perfil Actualizado Correctamente');

    /* Podemos obtener la data del Usuariop esto debiod a que estamos pasando al funcion
    del authenticate */

    } catch (e) {
        const error=new Error('Hubo un error');
        res.status(500).json({error:error.message})
        return
    }
}


export const uploadImage=async(req:Request,res:Response)=>{
    /* La parte de la libreria de formidable para obtener la ruta JPG */
    const form=formidable({multiples:false});
    
    try {
        form.parse(req,(error,fields,files)=>{
            console.log('Imprimiendo la data');

            /* LA CONFIGURACION ESTA AQUI TRANQUILO */
            cloudinary.config({ 
                cloud_name: process.env.CLOUDINARY_NAME, 
                api_key: process.env.CLOUDINARY_API_KEY, 
                api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
            });
            
            cloudinary.uploader.upload(files.file[0].filepath,{public_id:uuid()},async function(error,result){
                if(error){
                    const error=new Error('Hubo un error al subir la Imagen');
                    res.status(500).json({error:error.message})
                    return
                }
                if(result){
                    /* El modelo lo tiene ahi recordar que tenemos que anadir la parte de la imagen */
                    req.user.image=result.secure_url;
                    await req.user.save();
                    res.json({image:result.secure_url})   
                }      
            });
        })
    } catch (e) {
        const error=new Error('Hubo un error');
        res.status(500).json({error:error.message})
        return
    }
}

export const getUserByHandle=async(req:Request,res:Response)=>{
        try {
           const {handle}=req.params;

            const user=await User.findOne({handle}).select('-password -_id -__v -email');
            console.log(user);
            /* En este caso si la respuesta es NULL */
            if(!user){
                const error=new Error('El usuario no existe');
                res.status(404).json({error:error.message})
                return
            }

            res.json(user);
        } catch (e) {
            const error=new Error('Hubo un error');
            res.status(500).json({error:error.message})
            return
        }

}

export const searchByHandle=async(req:Request,res:Response)=>{
    try {
       const {handle}=req.body;
       const userExist=await User.findOne({handle})
        if(userExist){
            const error=new Error(`${handle} ya existe`);
            res.status(409).json({error:error.message})
            return
        }
        res.send(`${handle} esta disponible`);
        return
    } catch (e) {
        const error=new Error('Hubo un error');
        res.status(500).json({error:error.message})
        return
    }

}