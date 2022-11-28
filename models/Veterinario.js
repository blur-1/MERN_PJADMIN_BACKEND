import mongoose from "mongoose";
import randomIdtoken from "../helpers/idRandom.js";
import bcrypt from "bcrypt";

const veterinarioSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type:String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono:{
        type: String,
        default: null,
        trim: true,
    },
    web:{
        type: String,
        default: null
    },
    token:{
        type: String,
        default: randomIdtoken()
    },
    confirmado:{
        type: Boolean,
        default: false,
    }
});
//hasheo antes de almacenar el pass
veterinarioSchema.pre('save', async function(next){
    if(!this.isModified("password")){
        next();
    }
    const saltRounds = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, saltRounds);
    //console.log(this.password);
});

//commprobando el password
veterinarioSchema.methods.passwordVeryfied = async function(passwordForm){
    return await bcrypt.compare(passwordForm, this.password );
};

//registra el modelo 
const Veterinario = mongoose.model("Veterinario",veterinarioSchema);
export default Veterinario;