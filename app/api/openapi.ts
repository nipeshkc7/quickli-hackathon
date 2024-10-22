import { OpenAPIV3 } from "openapi-types";

const openApiDocument: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "AirDND Events API",
    version: "1.0.0",
    description: "API for managing AirDND events",
  },
  paths: {
    "/api/events": {
      get: {
        summary: "Get all events",
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Event",
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new event",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/EventInput",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Event created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Event",
                },
              },
            },
          },
          "500": {
            description: "Error creating event",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/events/{id}": {
      put: {
        summary: "Update an event",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/EventInput",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Event updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Event",
                },
              },
            },
          },
          "500": {
            description: "Error updating event",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/events/delete/{id}": {
      delete: {
        summary: "Delete an event",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Event deleted successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Event",
                },
              },
            },
          },
          "500": {
            description: "Error deleting event",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Event: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          location: { type: "string" },
          coordinates: {
            type: "array",
            items: { type: "number" },
            minItems: 2,
            maxItems: 2,
          },
          gameType: { type: "string" },
          date: { type: "string", format: "date" },
          participants: { type: "number" },
          description: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      EventInput: {
        type: "object",
        required: ["name", "location", "coordinates", "date", "gameType"],
        properties: {
          name: { type: "string" },
          location: { type: "string" },
          coordinates: {
            type: "array",
            items: { type: "number" },
            minItems: 2,
            maxItems: 2,
          },
          gameType: { type: "string" }, // New property for game type
          date: { type: "string", format: "date" },
          participants: { type: "number" },
          description: { type: "string" },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
    },
  },
};

export default openApiDocument;
