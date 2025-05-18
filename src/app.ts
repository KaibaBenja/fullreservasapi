import cors from 'cors';
import express from "express";
import logger from "morgan";
import path from "path";
import swaggerUI from "swagger-ui-express";
import { optionCors } from "./config/cors.config";
import { HOST, PORT } from "./config/dotenv.config";
import { sequelize } from "./config/sequalize.config";
import { initAssociations } from "./modules/initAssociations";
import { mainRoutes } from "./routes/main.routes";
import swaggerSpecs, { swaggerUiOptions } from "./swagger/swagger";

const app = express();

app.use(cors(optionCors));
app.use(express.json());
app.disable("x-powered-by");
app.use(logger("dev"));
app.use("/swagger-ui", express.static(path.join(__dirname, "swagger-ui")));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs, swaggerUiOptions));

initAssociations();

sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
  })
  .catch((error) => {
    console.error('No se pudo conectar a la base de datos:', error);
  });

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
