import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import conexionDB from "./config/db.js";
import veterinarioRoute from "./routes/veterinarioRoute.js";
import pacienteRoute from "./routes/pacienteRoute.js";
const app = express();
app.use(express.json());

dotenv.config();
conexionDB();

const dominiosPermitidos = [process.env.FRONTEND_URL];
const corsOptions={
    origin: function(origin, callback){
        if(dominiosPermitidos.indexOf(origin) !== -1){
            callback(null, true)
        }else{
            callback(new Error('no permitido por cors'))
        }
    }
}
app.use(cors(corsOptions));

app.use('/api/veterinarios', veterinarioRoute);
app.use('/api/pacientes', pacienteRoute);

const port = process.env.PORT || 4000;

app.listen(port, ()=>{
    console.log(`Corriendo n.n desde el puerto ${port}`);
})