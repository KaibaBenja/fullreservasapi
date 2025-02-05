import express from "express";
import cors from 'cors';
import { mainRoutes } from "./routes/main.routes";
import { optionCors } from "./config/cors.config";
import { PORT, HOST } from "./config/dotenv.config";
import logger from "morgan";

const app = express();

app.use(cors(optionCors)); 
app.use(express.json());
app.disable("x-powered-by"); 
app.use(logger("dev")); 

app.use("/api", mainRoutes);

app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente')
})

app.use((req, res) => {
  res.status(404).send('Ruta no encontrada :/')
})

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
