import swaggerJSDoc, { OAS3Definition, OAS3Options } from "swagger-jsdoc";

const swaggerDefinition: OAS3Definition = {
    openapi: "3.0.4",
    info: {
        title: "Documentacion Fullreservas API",
        version: "3.0.0",
        description: "API de Sistema de Reservas",
        contact: {
            name: "Leandro Schugurensky, Benjamín Sánchez Morales, Martin Bosch & Nicolás Boattini",
            email: "leo.schugu@gmail.com, sanchezmoralesbenjamin10@gmail.com, martinbosch1996@gmail.com, nicoboattini@gmail.com",
        },
        servers: [
            {   
                url: "http://localhost:3000",
                description: "Servidor Local"
            },
            {
                url: "https://fullreservasapi.up.railway.app/api/users/auth/register",
                description: "API DEVELOPMENT"
            }
        ]
    },
    
    
};

const swaggerOptions: OAS3Options = {
    swaggerDefinition,
    apis: [
        "./src/modules/address/routes/*.ts",
        "./src/modules/bookings/routes/*.ts",
        "./src/modules/memberships/routes/*.ts",
        "./src/modules/shops/routes/*.ts",
        "./src/modules/users/routes/*.ts",
    ]
};

export default swaggerJSDoc(swaggerOptions);