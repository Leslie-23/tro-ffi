import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tro-Ffi API Docs",
      version: "1.0.1",
      description: "Swagger docs for Tro-Ffi API",
    },
    servers: [{ url: "http://localhost:8000" }],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec, swaggerUi };
