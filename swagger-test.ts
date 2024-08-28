export default {
  openapi: "3.0.0",
  info: {
    title: "API de Barbearia",
    version: "1.0.0",
    description: "API para gerenciar uma barbearia",
  },
  servers: [
    {
      url: "http://192.168.56.1:3000",
    },
  ],
  paths: {
    "/addresses": {
      get: {
        tags: ["Address"],
        summary: "Get all addresses",
        responses: {
          "200": {
            description: "List of addresses",
          },
          "500": {
            description: "Failed to get addresses",
          },
        },
      },
      post: {
        tags: ["Address"],
        summary: "Create a new address",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Address",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Address created successfully",
          },
          "500": {
            description: "Failed to create address",
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Address: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          street: {
            type: "string",
          },
          city: {
            type: "string",
          },
          state: {
            type: "string",
          },
          zipCode: {
            type: "string",
          },
          country: {
            type: "string",
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};
