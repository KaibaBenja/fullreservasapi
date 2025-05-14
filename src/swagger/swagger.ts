import swaggerJSDoc, { OAS3Definition, OAS3Options } from "swagger-jsdoc";
import { SwaggerOptions, SwaggerUiOptions } from "swagger-ui-express";

const swaggerDefinition: OAS3Definition = {
    openapi: "3.0.4",
    info: {
        title: "Documentacion Fullreservas API",
        version: "1.0.0",
        description: "API de Sistema de Reservas",
        contact: {
            name: "Leandro Schugurensky, Benjamín Sánchez Morales, Martin Bosch & Nicolás Boattini",
            email: "leo.schugu@gmail.com, sanchezmoralesbenjamin10@gmail.com, martinbosch1996@gmail.com, nicoboattini@gmail.com",
        }
    },
    servers: [
        {   
            url: "http://localhost:3300",
            description: "Servidor Local"
        },
        {
            url: "https://fullreservasapi-production.up.railway.app",
            description: "API DEVELOPMENT"
        }
    ]
};

const swaggerSpecs: OAS3Options = {
    swaggerDefinition,
    apis: [
        "./src/modules/address/routes/*.ts",
        "./src/modules/bookings/routes/*.ts",
        "./src/modules/memberships/routes/*.ts",
        "./src/modules/shops/routes/*.ts",
        "./src/modules/users/routes/*.ts",
    ]
};

const swaggerOptions: SwaggerOptions = {
    docExpansion: "none",
    displayRequestDuration: true,
    defaultModelsExpandDepth: 1
}

export const swaggerUiOptions: SwaggerUiOptions = {
    customCssUrl: "/swagger-ui/SwaggerDark.css",
    customSiteTitle: "Fullreservas API Docs",
    swaggerOptions
};

export default swaggerJSDoc(swaggerSpecs);