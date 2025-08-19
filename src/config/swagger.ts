import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DrivenPass API',
      version: '1.0.0',
      description: 'API for secure information management, such as credentials, notes, cards, and Wi-Fi passwords.',
      contact: {
        name: 'Gabriela Tiago',
        email: 'gabrielatiagodearaujo@outlook.com',
        url: 'https://github.com/GabrielaTiago',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development Server',
      },
    ],
    tags: [
      {
        name: 'Auth',
      },
      {
        name: 'Credentials',
      },
      {
        name: 'Notes',
      },
      {
        name: 'Cards',
      },
      {
        name: 'Wifi',
      },
    ],
    components: {
      schemas: {
        Auth: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
              example: 'test@email.com',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password, must contain at least 10 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
              example: 'Test@12345',
            },
          },
          required: ['email', 'password'],
        },
        Credential: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Credential title, must be less than 20 characters',
              example: 'My Credential',
            },
            url: {
              type: 'string',
              description: 'Credential URL, must be a valid URL',
              example: 'https://www.google.com',
            },
            username: {
              type: 'string',
              description: 'Credential username, must be less than 20 characters',
              example: 'john.doe',
            },
            password: {
              type: 'string',
              description: 'Credential password, must be at least 4 digits and at most 6 digits',
              example: '1234',
            },
          },
          required: ['title', 'url', 'username', 'password'],
        },
        Note: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Note title, must be less than 50 characters',
              example: 'My Note',
            },
            text: {
              type: 'string',
              description: 'Note text, must be less than 1000 characters',
              example:
                'Cillum voluptate Lorem nostrud dolore commodo eiusmod veniam enim culpa elit ea. Non excepteur ipsum aliquip et voluptate voluptate officia cupidatat fugiat eiusmod aliqua adipisicing eu. Officia deserunt eiusmod nostrud ullamco mollit dolore. Dolor nulla laborum sunt mollit aliqua ea aliqua aliquip non irure voluptate.',
            },
          },
          required: ['title', 'text'],
        },
        Card: {
          type: 'object',
          properties: {
            nickname: {
              type: 'string',
              description: 'Card nickname, must be less than 20 characters',
              example: 'My Card',
            },
            printedName: {
              type: 'string',
              description: 'Card printed name, must be uppercase only letters with maximum 50 characters',
              example: 'JOHN DOE',
            },
            number: {
              type: 'string',
              description: 'Card number, must be at least 16 digits',
              example: '1234567890123456',
            },
            cvv: {
              type: 'string',
              description: 'Card CVV, must be 3 digits',
              example: '123',
            },
            expirationDate: {
              type: 'string',
              description: 'Card expiration date, must be in the format MM/YY',
              example: '12/25',
            },
            password: {
              type: 'string',
              description: 'Card password, must be at least 4 digits and at most 6 digits',
              example: '1234',
            },
            virtual: {
              type: 'boolean',
              description: 'Card virtual, must be a boolean',
              example: false,
            },
            type: {
              type: 'string',
              description: 'Card type, must be either credit, debit or both',
              example: 'both',
            },
          },
          required: ['nickname', 'printedName', 'number', 'cvv', 'expirationDate', 'password', 'virtual', 'type'],
        },
        Wifi: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Wifi title, must be less than 50 characters',
              example: 'My Wifi',
            },
            wifiName: {
              type: 'string',
              description: 'Wifi name, must be less than 50 characters',
              example: 'My Wifi',
            },
            password: {
              type: 'string',
              description: 'Wifi password, must be at least 8 characters',
              example: '12345678',
            },
          },
          required: ['title', 'wifiName', 'password'],
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Insert the JWT token in the format: Bearer {token}',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
