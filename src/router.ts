import { Router } from "express";
import { body } from 'express-validator'
import { createAccount, getUser, getUserByHandle, login, searchByHandle, updateProfile, uploadImage } from "./handlers";
import { handleInputErrors } from "./middleware/validation";
import { authenticate } from "./middleware/auth";

const router=Router();

/* En esta  */


router.post('/auth/register',
    body('handle')
        .notEmpty()
        .withMessage('El handle no puede ir  vacio'),
    body('name')
        .notEmpty()
        .withMessage('El Nombre no puede ir  vacio'),
    body('email')
        .isEmail()
        .withMessage('Email no Valido'),
    body('password')
        .isLength({min:8,max:20})
        .withMessage('El password es muy corto, necesita minimo 8 caractreres'),
        handleInputErrors,
        /*Este las almacena en memoria, pero el otro que tenemos que hacer es rfevelarlo */
    createAccount )

router.post('/auth/login',
    body('email')
        .isEmail()
        .withMessage('Email no Valido'),
    body('password')
        .notEmpty()
        .withMessage('El password es Obligatorio'),
    handleInputErrors,
    login    
)

router.get('/user',authenticate,getUser)

router.patch('/user',
    body('handle')
        .notEmpty()
        .withMessage('El handle no puede ir vacio'),
    body('description')
        .notEmpty()
        .withMessage('El descripcion no puede ir vacia'),
    handleInputErrors
    ,authenticate,updateProfile)

router.post('/user/image',authenticate,uploadImage)

router.get('/:handle',getUserByHandle)

router.post('/search',
    body('handle')
        .notEmpty()
        .withMessage('El handle no puede ir vacio'),
    searchByHandle
)



export default router