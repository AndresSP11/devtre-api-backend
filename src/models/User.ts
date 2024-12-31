import mongoose,{Document, Schema} from "mongoose";

/* Este extends se realiza para la parte del  */
export interface TUser extends Document{
    handle:string
    name:string
    email:string
    password:string
    description:string
    image:string
    links:string
}

const userSchema=new Schema({
    handle:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        default:''
    },
    image:{
        type:String,
        default:''
    },
    links:{
        type:String,
        default:'[]'
    }
    /* En este caso la parte de default hace o permite que ingrese vacio caudn ose crea el nuevo Usuario */
})

const User= mongoose.model<TUser>('User',userSchema);
export default User