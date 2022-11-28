import express from "express";
const router = express.Router();
import {registrar, 
        perfil, 
        confirmar, 
        autenticar, 
        forgotPassword,
        verifyToken, 
        newpassword,
        actualizarPerfil,
        actualizarPassword} from '../controllers/veterinarioController.js'
import checkAuth from '../middelware/authMiddelware.js'

//area publica
router.post("/", registrar);
router.get("/confirmar/:token", confirmar );
router.post("/login", autenticar );
router.post("/forgot-password", forgotPassword);
router.get("/forgot-password/:token", verifyToken);
router.post("/forgot-password/:token", newpassword);


//area privada
router.get("/perfil", checkAuth, perfil );
router.put("/perfil/:id", checkAuth, actualizarPerfil );
router.put("/actualizar-password", checkAuth, actualizarPassword );
export default router;