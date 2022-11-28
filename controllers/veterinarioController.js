import Veterinario from "../models/Veterinario.js";
import createJWT from "../helpers/createJWT.js";
import randomIdtoken from "../helpers/idRandom.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailForgotPassword from "../helpers/emailForgotPassword.js";

const registrar = async (req,res)=>{
    const{email, nombre} = req.body;
    //identificar usuarios registrados
    const findUser = await Veterinario.findOne({email});
    if(findUser){
        const error = new Error("Usuario ya registrado u.u");
        return res.status(400).json({msg: error.message});
    }
    try {
        const veterinario = new Veterinario(req.body);
        const veterinarioSaved = await veterinario.save();
        
        //enviando el email
        emailRegistro({
            email,
            nombre,
            token: veterinarioSaved.token
        });

        res.json(veterinarioSaved);
    } catch (error) {
        console.log(error);
    }
};

const perfil = (req,res)=>{
    const {veterinario} = req
    res.json({perfil: veterinario});
};

const confirmar = async (req,res)=>{   //params sirve para leer datos de la url dinámica;
    const {token} = req.params;
    const userToken = await Veterinario.findOne({token});
    if(!userToken){
        const error = new Error("Token no valido");
        return res.status(404).json({msg: error.message});
    }
    try {
        userToken.token= null;
        userToken.confirmado = true;
        await userToken.save();
        res.json({msg: "token de usuario confirmado"});
    } catch (error) {
        console.log(error);
    }
};
const autenticar = async (req, res) =>{   //console.log(req.body);
    const{email, password} = req.body;
    //1. Comprobar si el usurio exite
    const findUser = await Veterinario.findOne({email});
    if(!findUser){
        const error = new Error("El usuario no existe");
        return res.status(404).json({msg: error.message});
    }
    //comprobar si ha confirmado su cuenta
    if(!findUser.confirmado){
        const error = new Error("No ha confirmado su cuenta");
        return res.status(403).json({msg: error.message});
    }
    //comprobar el password para autenticar login
    if(await findUser.passwordVeryfied(password)){ 

        res.json({
            _id: findUser._id,
            nombre: findUser.nombre,
            email: findUser.email,
            token: createJWT(findUser.id)
        });
    }else{
        const error = new Error("Password incorrecto");
        return res.status(403).json({msg: error.message});
    }
};

const forgotPassword= async (req,res)=>{
    const {email} = req.body;
    const existeVeterinario = await Veterinario.findOne({email})
    if(!existeVeterinario){
        const error = new Error("El usuario no existe");
        return res.status(400).json({msg: error.message});
    }
    try {
        existeVeterinario.token = randomIdtoken();
        await existeVeterinario.save()
        //enviar email con instrucciones
        emailForgotPassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        });

        res.json({msg: "hemos enviado un email a su correo"});
    } catch (error) {
        console.log(error);
    }
}
const verifyToken= async (req,res)=>{
    const {token} = req.params;

    const tokenValido = await Veterinario.findOne({token});

    if(tokenValido){
        res.json({msg:"token valido y usuario existe"});
    }else{
        const error = new Error('Token no valido');
        return res.status(400).json({msg: error.message});
    }
};

const newpassword= async (req,res)=>{
    const {token} = req.params;
    const {password} = req.body;

    const veterinario = await Veterinario.findOne({token});
    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }
    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({msg: "Password modificado !"});

    } catch (error) {
        console.log(error);
    }
}
const actualizarPerfil = async (req,res) =>{

    const veterinario = await Veterinario.findById(req.params.id);
    if(!veterinario){
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    }
    if(veterinario.email !== req.body.email){
        const existeEmail = await Veterinario.findOne(req.body.email)
        if(existeEmail){
            const error = new Error("Ese email ya esta en uso");
            return res.status(400).json({msg: error.message});
        }
    }
    try {
        veterinario.nombre = req.body.nombre;
        veterinario.telefono = req.body.telefono;
        veterinario.email = req.body.email;

        const veterinarioActualizado = await veterinario.save()
        res.json(veterinarioActualizado);
        
    } catch (error) {
        console.log(error);
    }
}

const actualizarPassword = async (req,res) =>{
    const {passwordActual, passwordNuevo} = req.body

    const veterinario = await Veterinario.findById(req.veterinario.id);
    if(!veterinario){
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    }
    if(await veterinario.passwordVeryfied(passwordActual)){
        veterinario.password = passwordNuevo;
        await veterinario.save();
        res.json({msg: "Password actualizado"})
    }else{
        const error = new Error("Password incorrecto");
        return res.status(400).json({msg: error.message});
    }
}

export { registrar, 
         perfil,
         autenticar,
         confirmar,
         forgotPassword,
         verifyToken,
         newpassword,
         actualizarPerfil,
         actualizarPassword
        };