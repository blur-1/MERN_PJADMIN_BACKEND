import express from "express";
const router = express.Router();
import {agregarPaciente,obtenerPacientes, obtenerPaciente, actualizarPaciente,eliminarPaciente} from "../controllers/pacienteController.js"
import checkAuth from "../middelware/authMiddelware.js"


router.post("/", checkAuth, agregarPaciente);
router.get("/", checkAuth, obtenerPacientes );

router.get("/:id", checkAuth, obtenerPaciente);
router.put("/:id", checkAuth, actualizarPaciente);
router.delete("/:id", checkAuth, eliminarPaciente);
export default router;

