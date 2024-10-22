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
    paths: {
        // EVENTS
        '/api/event/{id}': {
            get: {
                summary: 'Get specific event',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Event',
                                    },
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Event not found',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error',
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Error getting event details',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error',
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/events': {
            get: {
                summary: 'Get all events',
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Event',
                                    },
                                },
                            },
                        },
                    },
                },
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
        // USERS
        '/api/user/{id}': {
            get: {
                summary: 'Get specific user',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/User',
                                    },
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'User not found',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error',
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Error getting user details',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error',
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/users': {
            get: {
                summary: 'Get all users',
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/User',
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                summary: 'Create a new user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UserInput',
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'User created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/User',
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Error creating user',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error',
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/users/{id}': {
            put: {
                summary: 'Update user details',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UserInput',
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'User details updated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/User',
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Error updating user details',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error',
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/users/delete/{id}': {
            delete: {
                summary: 'Delete a user',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'User deleted successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/User',
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Error deleting user',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error',
                                },
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
            User: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    fname: { type: 'string' },
                    lname: { type: 'string' },
                    age: { type: 'number' },
                    email: { type: 'string' },
                    role: { type: 'string' },
                    rating: { type: 'string' },
                },
            },
            UserInput: {
                type: 'object',
                required: ['fname', 'lname', 'age', 'email'],
                properties: {
                    fname: { type: 'string' },
                    lname: { type: 'string' },
                    age: { type: 'number' },
                    email: { type: 'string' },
                    role: { type: 'string' },
                    rating: { type: 'string' },
                },
            },
            Error: {
                type: 'object',
                properties: {
                    error: { type: 'string' },
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
