export default {
  openapi: '3.0.0',
  info: {
    title: 'API de Barbearia',
    version: '1.0.0',
    description: 'API para gerenciar uma barbearia',
  },
  servers: [
    {
      url: 'https://apib-arbearia.vercel.app',
    },
  ],
  paths: {
    '/register': {
      post: {
        tags: ['User'],
        summary: 'Create a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserRegistration',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User created successfully',
          },
          '400': {
            description: 'User already exists',
          },
          '500': {
            description: 'Failed to create user',
          },
        },
      },
    },
    '/login': {
      post: {
        tags: ['User'],
        summary: 'Login a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserLogin',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Logged in successfully',
          },
          '401': {
            description: 'Invalid credentials',
          },
          '500': {
            description: 'Failed to login',
          },
        },
      },
    },
    '/refresh-token': {
      post: {
        tags: ['Authentication'],
        summary: 'Refresh access token',
        responses: {
          '200': {
            description: 'Access token refreshed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Invalid refresh token',
          },
          '500': {
            description: 'Failed to refresh access token',
          },
        },
      },
    },
    '/barbers': {
      get: {
        tags: ['Barber'],
        summary: 'Get all barbers',
        responses: {
          '200': {
            description: 'List of barbers',
          },
          '500': {
            description: 'Failed to get barbers',
          },
        },
      },
      post: {
        tags: ['Barber'],
        summary: 'Create a new barber',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Barber',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Barber created successfully',
          },
          '500': {
            description: 'Failed to create barber',
          },
        },
      },
    },
    '/barbers/{id}': {
      get: {
        tags: ['Barber'],
        summary: 'Get a barber by ID',
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
            description: 'Barber found',
          },
          '404': {
            description: 'Barber not found',
          },
          '500': {
            description: 'Failed to get barber',
          },
        },
      },
      put: {
        tags: ['Barber'],
        summary: 'Update a barber by ID',
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
                $ref: '#/components/schemas/Barber',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Barber updated successfully',
          },
          '404': {
            description: 'Barber not found',
          },
          '500': {
            description: 'Failed to update barber',
          },
        },
      },
      delete: {
        tags: ['Barber'],
        summary: 'Delete a barber by ID',
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
          '204': {
            description: 'Barber deleted successfully',
          },
          '500': {
            description: 'Failed to delete barber',
          },
        },
      },
    },
    '/appointments': {
      get: {
        tags: ['Appointment'],
        summary: 'Get all appointments',
        responses: {
          '200': {
            description: 'List of appointments',
          },
          '500': {
            description: 'Failed to get appointments',
          },
        },
      },
      post: {
        tags: ['Appointment'],
        summary: 'Create a new appointment',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Appointment',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Appointment created successfully',
          },
          '500': {
            description: 'Failed to create appointment',
          },
        },
      },
    },
    '/appointments/{id}': {
      get: {
        tags: ['Appointment'],
        summary: 'Get an appointment by ID',
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
            description: 'Appointment found',
          },
          '404': {
            description: 'Appointment not found',
          },
          '500': {
            description: 'Failed to get appointment',
          },
        },
      },
      put: {
        tags: ['Appointment'],
        summary: 'Update an appointment by ID',
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
                $ref: '#/components/schemas/Appointment',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Appointment updated successfully',
          },
          '404': {
            description: 'Appointment not found',
          },
          '500': {
            description: 'Failed to update appointment',
          },
        },
      },
      delete: {
        tags: ['Appointment'],
        summary: 'Delete an appointment by ID',
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
          '204': {
            description: 'Appointment deleted successfully',
          },
          '500': {
            description: 'Failed to delete appointment',
          },
        },
      },
    },
    '/notifications': {
      post: {
        tags: ['Notification'],
        summary: 'Send a notification',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Notification',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Notification sent successfully',
          },
          '500': {
            description: 'Failed to send notification',
          },
        },
      },
    },
    '/addresses': {
      get: {
        tags: ['Address'],
        summary: 'Get all addresses',
        responses: {
          '200': {
            description: 'List of addresses',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Address',
                  },
                  example: [
                    {
                      id: '60d0fe4f5311236168a109ca',
                      street: 'Rua Exemplo',
                      number: '123',
                      complement: 'Apto 1',
                      locality: 'Centro',
                      city: 'São Paulo',
                      state: 'SP',
                      zipCode: '01000-000',
                      country: 'Brasil',
                    },
                  ],
                },
              },
            },
          },
          '500': {
            description: 'Failed to get addresses',
          },
        },
      },
      post: {
        tags: ['Address'],
        summary: 'Create a new address',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Address',
              },
              example: {
                street: 'Rua Nova',
                number: '456',
                complement: 'Bloco B',
                locality: 'Bairro Novo',
                city: 'Rio de Janeiro',
                state: 'RJ',
                zipCode: '22000-000',
                country: 'Brasil',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Address created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Address',
                },
                example: {
                  id: '60d0fe4f5311236168a109cb',
                  street: 'Rua Nova',
                  number: '456',
                  complement: 'Bloco B',
                  locality: 'Bairro Novo',
                  city: 'Rio de Janeiro',
                  state: 'RJ',
                  zipCode: '22000-000',
                  country: 'Brasil',
                },
              },
            },
          },
          '500': {
            description: 'Failed to create address',
          },
        },
      },
    },
    '/addresses/{id}': {
      get: {
        tags: ['Address'],
        summary: 'Get an address by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            example: '60d0fe4f5311236168a109ca',
          },
        ],
        responses: {
          '200': {
            description: 'Address found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Address',
                },
                example: {
                  id: '60d0fe4f5311236168a109ca',
                  street: 'Rua Exemplo',
                  number: '123',
                  complement: 'Apto 1',
                  locality: 'Centro',
                  city: 'São Paulo',
                  state: 'SP',
                  zipCode: '01000-000',
                  country: 'Brasil',
                },
              },
            },
          },
          '404': {
            description: 'Address not found',
          },
          '500': {
            description: 'Failed to get address',
          },
        },
      },
      put: {
        tags: ['Address'],
        summary: 'Update an address by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            example: '60d0fe4f5311236168a109ca',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Address',
              },
              example: {
                street: 'Rua Alterada',
                number: '789',
                complement: 'Bloco C',
                locality: 'Bairro Alterado',
                city: 'Belo Horizonte',
                state: 'MG',
                zipCode: '31000-000',
                country: 'Brasil',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Address updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Address',
                },
                example: {
                  id: '60d0fe4f5311236168a109ca',
                  street: 'Rua Alterada',
                  number: '789',
                  complement: 'Bloco C',
                  locality: 'Bairro Alterado',
                  city: 'Belo Horizonte',
                  state: 'MG',
                  zipCode: '31000-000',
                  country: 'Brasil',
                },
              },
            },
          },
          '404': {
            description: 'Address not found',
          },
          '500': {
            description: 'Failed to update address',
          },
        },
      },
      delete: {
        tags: ['Address'],
        summary: 'Delete an address by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            example: '60d0fe4f5311236168a109ca',
          },
        ],
        responses: {
          '204': {
            description: 'Address deleted successfully',
          },
          '500': {
            description: 'Failed to delete address',
          },
        },
      },
    },
    '/auth/google': {
      post: {
        tags: ['Authentication'],
        summary: 'Autenticação com o Google',
        operationId: 'authGoogle',
        requestBody: {
          description: 'Token ID do Google recebido após a autenticação do usuário',
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  token: {
                    type: 'string',
                    description: 'Token ID fornecido pelo Google após a autenticação do usuário',
                  },
                },
                required: ['token'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Autenticação bem-sucedida e cookies de sessão configurados',
          },
          '401': {
            description: 'Falha na autenticação',
          },
          '500': {
            description: 'Erro interno do servidor',
          },
        },
      },
    },
    '/subscription/create-plan': {
      post: {
        tags: ['Subscription'],
        summary: 'Create a new subscription plan',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SubscriptionPlan',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Subscription plan created successfully',
          },
          '500': {
            description: 'Failed to create subscription plan',
          },
        },
      },
    },
    '/subscription/get-card-token': {
      post: {
        tags: ['Subscription'],
        summary: 'Get a card token and save it',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  userId: {
                    type: 'string',
                    description: 'ID of the user',
                    example: '60d5ec49c25e4b23d8a15f4a', // Exemplo de ObjectId
                  },
                  cardNumber: {
                    type: 'string',
                    description: 'Credit card number',
                    example: '4111111111111111',
                  },
                  cardExpiry: {
                    type: 'string',
                    description: 'Credit card expiry date in MM/YY format',
                    example: '12/2030',
                  },
                  cardCVC: {
                    type: 'string',
                    description: 'Credit card CVC',
                    example: '123',
                  },
                  holderName: {
                    type: 'string',
                    description: 'Card holder name',
                    example: 'John Doe',
                  },
                  email: {
                    type: 'string',
                    description: 'Email of the card holder',
                    example: 'john.doe@example.com',
                  },
                  taxId: {
                    type: 'string',
                    description: 'CPF/CNPJ sem caracteres',
                    example: '12345678909',
                  },
                },
                required: [
                  'userId',
                  'cardNumber',
                  'cardExpiry',
                  'cardCVC',
                  'holderName',
                  'email',
                  'taxId',
                ],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Card token saved successfully',
          },
          '400': {
            description: 'User ID is required or invalid',
          },
          '404': {
            description: 'User not found',
          },
          '500': {
            description: 'Error getting card token',
          },
        },
      },
    },
    '/subscription/subscribe': {
      post: {
        tags: ['Subscription'],
        summary: 'Subscribe a user to a plan',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SubscriptionData',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User subscribed successfully',
          },
          '500': {
            description: 'Failed to subscribe user',
          },
        },
      },
    },
    '/subscription/cancel': {
      put: {
        tags: ['Subscription'],
        summary: 'Cancel a subscription',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CancelSubscription',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Subscription canceled successfully',
          },
          '500': {
            description: 'Failed to cancel subscription',
          },
        },
      },
    },
    '/subscription/plans': {
      get: {
        tags: ['Subscription'],
        summary: 'Get all subscription plans',
        responses: {
          '200': {
            description: 'List of subscription plans',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/listPlans',
                  },
                },
              },
            },
          },
          '500': {
            description: 'Failed to get subscription plans',
          },
        },
      },
    },
    '/subscription/cards': {
      post: {
        tags: ['Subscription'],
        summary: 'List all card tokens for a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  userId: {
                    type: 'string',
                    description: 'ID of the user',
                  },
                },
                required: ['userId'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'List of card tokens',
          },
          '400': {
            description: 'User ID is required',
          },
          '500': {
            description: 'Error listing card tokens',
          },
        },
      },
    },
    '/subscription/customers/update': {
      post: {
        tags: ['Customer'],
        summary: 'Update customer data',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateCustomerRequest',
              },
              examples: {
                customer: {
                  value: {
                    userId: '1234567890',
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    tax_id: '12345678901',
                    phones: [
                      {
                        country: '55',
                        area: '11',
                        number: '987654321',
                      },
                    ],
                    birth_date: '2000-12-20',
                    address: {
                      street: 'Rua Exemplo',
                      number: '123',
                      complement: 'Apto 101',
                      locality: 'Bairro Exemplo',
                      city: 'Cidade Exemplo',
                      region_code: 'SP',
                      postal_code: '12345678',
                      country: 'BRA',
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Customer data updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Customer',
                },
                examples: {
                  customer: {
                    value: {
                      id: '1234567890',
                      reference_id: 'uuid-generated-id',
                      name: 'John Doe',
                      email: 'john.doe@example.com',
                      tax_id: '12345678901',
                      phones: [
                        {
                          country: '55',
                          area: '11',
                          number: '987654321',
                        },
                      ],
                      birth_date: '2000-12-20',
                      address: {
                        street: 'Rua Exemplo',
                        number: '123',
                        complement: 'Apto 101',
                        locality: 'Bairro Exemplo',
                        city: 'Cidade Exemplo',
                        region_code: 'SP',
                        postal_code: '12345678',
                        country: 'BRA',
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Missing required fields or Customer ID not found for user',
          },
          '404': {
            description: 'User not found',
          },
          '500': {
            description: 'Error updating customer data',
          },
        },
      },
    },
    '/subscription/atualizar/cartao': {
      put: {
        tags: ['Subscription'],
        summary: 'Update payment card information',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  customerId: { type: 'string', description: 'Customer ID' },
                  cardNumber: {
                    type: 'string',
                    description: 'Credit card number',
                  },
                  cardCvc: { type: 'string', description: 'Card CVC' },
                  expMonth: {
                    type: 'string',
                    description: 'Expiry month (MM)',
                  },
                  expYear: {
                    type: 'string',
                    description: 'Expiry year (YYYY)',
                  },
                  email: {
                    type: 'string',
                    description: 'Email of the cardholder',
                  },
                  nome: {
                    type: 'string',
                    description: 'Name of the cardholder',
                  },
                },
                required: [
                  'customerId',
                  'cardNumber',
                  'cardCvc',
                  'expMonth',
                  'expYear',
                  'email',
                  'nome',
                ],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Billing info updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    response: { type: 'object' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad Request - Missing required fields or invalid input',
          },
          '404': {
            description: 'Address not found',
          },
          '500': {
            description: 'Error updating billing info',
          },
        },
      },
    },
    '/services': {
      get: {
        tags: ['Service'],
        summary: 'Get all services',
        responses: {
          '200': {
            description: 'List of services',
          },
          '500': {
            description: 'Failed to get services',
          },
        },
      },
      post: {
        tags: ['Service'],
        summary: 'Create a new service',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Service',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Service created successfully',
          },
          '500': {
            description: 'Failed to create service',
          },
        },
      },
    },
    '/services/{id}': {
      get: {
        tags: ['Service'],
        summary: 'Get service by ID',
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
            description: 'Service details',
          },
          '404': {
            description: 'Service not found',
          },
          '500': {
            description: 'Failed to get service',
          },
        },
      },
      put: {
        tags: ['Service'],
        summary: 'Update service by ID',
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
                $ref: '#/components/schemas/Service',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Service updated successfully',
          },
          '404': {
            description: 'Service not found',
          },
          '500': {
            description: 'Failed to update service',
          },
        },
      },
      delete: {
        tags: ['Service'],
        summary: 'Delete service by ID',
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
          '204': {
            description: 'Service deleted successfully',
          },
          '404': {
            description: 'Service not found',
          },
          '500': {
            description: 'Failed to delete service',
          },
        },
      },
    },
    '/guidances': {
      get: {
        tags: ['Guidance'],
        summary: 'Get all active guidances',
        responses: {
          '200': {
            description: 'List of active guidances',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Guidance',
                  },
                },
              },
            },
          },
          '500': {
            description: 'Failed to get guidances',
          },
        },
      },
      post: {
        tags: ['Guidance'],
        summary: 'Create a new guidance',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/GuidanceCreate',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Guidance created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Guidance',
                },
              },
            },
          },
          '400': {
            description: 'Bad request - missing required fields',
          },
          '500': {
            description: 'Failed to create guidance',
          },
        },
      },
    },
    '/guidances/{id}': {
      get: {
        tags: ['Guidance'],
        summary: 'Get guidance by ID',
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
            description: 'Guidance details',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Guidance',
                },
              },
            },
          },
          '404': {
            description: 'Guidance not found',
          },
          '500': {
            description: 'Failed to get guidance',
          },
        },
      },
      put: {
        tags: ['Guidance'],
        summary: 'Update guidance by ID',
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
                $ref: '#/components/schemas/GuidanceCreate',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Guidance updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Guidance',
                },
              },
            },
          },
          '404': {
            description: 'Guidance not found',
          },
          '500': {
            description: 'Failed to update guidance',
          },
        },
      },
      delete: {
        tags: ['Guidance'],
        summary: 'Delete guidance by ID',
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
          '204': {
            description: 'Guidance deleted successfully',
          },
          '404': {
            description: 'Guidance not found',
          },
          '500': {
            description: 'Failed to delete guidance',
          },
        },
      },
    },
    '/guidances/{id}/toggle-active': {
      patch: {
        tags: ['Guidance'],
        summary: 'Toggle guidance active status',
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
            description: 'Guidance status toggled successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Guidance',
                },
              },
            },
          },
          '404': {
            description: 'Guidance not found',
          },
          '500': {
            description: 'Failed to toggle guidance status',
          },
        },
      },
    },
    '/guidances/user/{userId}': {
      get: {
        tags: ['Guidance'],
        summary: 'Get guidances by user ID',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'List of user guidances',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Guidance',
                  },
                },
              },
            },
          },
          '500': {
            description: 'Failed to get user guidances',
          },
        },
      },
    },
    '/guidances/user/{userId}/active': {
      get: {
        tags: ['Guidance'],
        summary: 'Get active guidances by user ID',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'List of active user guidances',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Guidance',
                  },
                },
              },
            },
          },
          '500': {
            description: 'Failed to get active user guidances',
          },
        },
      },
    },
    '/guidances/professional/{professionalId}': {
      get: {
        tags: ['Guidance'],
        summary: 'Get guidances by professional ID',
        parameters: [
          {
            name: 'professionalId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'List of professional guidances',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Guidance',
                  },
                },
              },
            },
          },
          '500': {
            description: 'Failed to get professional guidances',
          },
        },
      },
    },
    '/guidances/service/{appServiceId}/category/{categoryId}': {
      get: {
        tags: ['Guidance'],
        summary: 'Get guidances by service and category',
        parameters: [
          {
            name: 'appServiceId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
          {
            name: 'categoryId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'List of guidances for service and category',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Guidance',
                  },
                },
              },
            },
          },
          '500': {
            description: 'Failed to get guidances by service and category',
          },
        },
      },
    },
    '/guidances/date-range/search': {
      get: {
        tags: ['Guidance'],
        summary: 'Get guidances by date range',
        parameters: [
          {
            name: 'startDate',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
              format: 'date-time',
            },
          },
          {
            name: 'endDate',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
              format: 'date-time',
            },
          },
        ],
        responses: {
          '200': {
            description: 'List of guidances in date range',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Guidance',
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad request - invalid date format',
          },
          '500': {
            description: 'Failed to get guidances by date range',
          },
        },
      },
    },
    '/guidances/expired/list': {
      get: {
        tags: ['Guidance'],
        summary: 'Get all expired guidances',
        responses: {
          '200': {
            description: 'List of expired guidances',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Guidance',
                  },
                },
              },
            },
          },
          '500': {
            description: 'Failed to get expired guidances',
          },
        },
      },
    },
    '/guidances/{id}/attachments': {
      post: {
        tags: ['Guidance'],
        summary: 'Add attachment to guidance',
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
                $ref: '#/components/schemas/Attachment',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Attachment added successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Guidance',
                },
              },
            },
          },
          '400': {
            description: 'Bad request - missing required attachment data',
          },
          '404': {
            description: 'Guidance not found',
          },
          '500': {
            description: 'Failed to add attachment',
          },
        },
      },
    },
    '/guidances/{id}/attachments/{attachmentId}': {
      delete: {
        tags: ['Guidance'],
        summary: 'Remove attachment from guidance',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
          {
            name: 'attachmentId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Attachment removed successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Guidance',
                },
              },
            },
          },
          '404': {
            description: 'Guidance not found',
          },
          '500': {
            description: 'Failed to remove attachment',
          },
        },
      },
    },
    '/advertisements': {
      get: {
        tags: ['Advertisement'],
        summary: 'Get advertisements by professional',
        responses: {
          '200': {
            description: 'List of professional advertisements',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Advertisement',
                  },
                },
              },
            },
          },
          '500': {
            description: 'Failed to get advertisements',
          },
        },
      },
      post: {
        tags: ['Advertisement'],
        summary: 'Create a new advertisement',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AdvertisementInput',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Advertisement created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Advertisement',
                },
              },
            },
          },
          '400': {
            description: 'Bad request - missing required fields',
          },
          '500': {
            description: 'Failed to create advertisement',
          },
        },
      },
    },
    '/advertisements/{id}': {
      get: {
        tags: ['Advertisement'],
        summary: 'Get advertisement by ID',
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
            description: 'Advertisement details',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Advertisement',
                },
              },
            },
          },
          '404': {
            description: 'Advertisement not found',
          },
          '500': {
            description: 'Failed to get advertisement',
          },
        },
      },
      put: {
        tags: ['Advertisement'],
        summary: 'Update advertisement',
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
                $ref: '#/components/schemas/AdvertisementUpdate',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Advertisement updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Advertisement',
                },
              },
            },
          },
          '403': {
            description: 'Not authorized to update this advertisement',
          },
          '404': {
            description: 'Advertisement not found',
          },
          '500': {
            description: 'Failed to update advertisement',
          },
        },
      },
      delete: {
        tags: ['Advertisement'],
        summary: 'Delete advertisement',
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
          '204': {
            description: 'Advertisement deleted successfully',
          },
          '403': {
            description: 'Not authorized to delete this advertisement',
          },
          '404': {
            description: 'Advertisement not found',
          },
          '500': {
            description: 'Failed to delete advertisement',
          },
        },
      },
    },
    '/advertisements/for-user/{userId}': {
      get: {
        tags: ['Advertisement'],
        summary: 'Get advertisements for user',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: false,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'List of advertisements for user',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Advertisement',
                  },
                },
              },
            },
          },
          '500': {
            description: 'Failed to get advertisements for user',
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      googleAuth: {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
            tokenUrl: 'https://oauth2.googleapis.com/token',
            scopes: {
              profile: 'Access your profile information',
              email: 'Access your email address',
            },
          },
        },
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
          role: {
            type: 'string',
          },
        },
      },
      UserRegistration: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
        },
      },
      UserLogin: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
        },
      },
      Barber: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
          phone: {
            type: 'string',
          },
          speciality: {
            type: 'string',
          },
          code: {
            type: 'string',
          },
        },
      },
      Appointment: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          userId: {
            type: 'string',
          },
          barberId: {
            type: 'string',
          },
          date: {
            type: 'string',
            format: 'date-time',
          },
          time: {
            type: 'string',
          },
          status: {
            type: 'string',
          },
        },
      },
      Notification: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          userId: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
          read: {
            type: 'boolean',
          },
        },
      },
      Address: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          street: {
            type: 'string',
          },
          number: {
            type: 'string',
          },
          complement: {
            type: 'string',
          },
          locality: {
            type: 'string',
          },
          city: {
            type: 'string',
          },
          state: {
            type: 'string',
          },
          zipCode: {
            type: 'string',
          },
          country: {
            type: 'string',
          },
        },
        required: ['street', 'number', 'city', 'state', 'zipCode', 'country'],
        example: {
          id: '60d0fe4f5311236168a109ca',
          street: 'Rua Exemplo',
          number: '123',
          complement: 'Apto 1',
          locality: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01000-000',
          country: 'Brasil',
        },
      },
      SubscriptionPlan: {
        type: 'object',
      },
      CardData: {
        type: 'object',
        properties: {
          cardNumber: {
            type: 'string',
          },
          cardBrand: {
            type: 'string',
          },
          cardCvv: {
            type: 'string',
          },
          cardExpirationMonth: {
            type: 'string',
          },
          cardExpirationYear: {
            type: 'string',
          },
        },
      },
      SubscriptionData: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
          },
          planId: {
            type: 'string',
          },
          cardToken: {
            type: 'string',
          },
          holderName: {
            type: 'string',
          },
          holderCPF: {
            type: 'string',
          },
          holderBirthDate: {
            type: 'string',
          },
          holderPhoneAreaCode: {
            type: 'string',
          },
          holderPhoneNumber: {
            type: 'string',
          },
        },
      },
      CancelSubscription: {
        type: 'object',
        properties: {
          subscriptionCode: {
            type: 'string',
          },
        },
      },
      listPlans: {
        type: 'object',
        properties: {
          reference: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          charge: {
            type: 'string',
          },
          period: {
            type: 'string',
          },
          amountPerPayment: {
            type: 'string',
          },
          expiration: {
            type: 'object',
            properties: {
              value: {
                type: 'string',
              },
              unit: {
                type: 'string',
              },
            },
          },
        },
      },
      UpdateCustomerRequest: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: 'ID of the user',
          },
          name: {
            type: 'string',
            description: 'Name of the customer',
          },
          email: {
            type: 'string',
            description: 'Email of the customer',
          },
          tax_id: {
            type: 'string',
            description: 'Tax ID of the customer',
          },
          phones: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                country: {
                  type: 'string',
                },
                area: {
                  type: 'string',
                },
                number: {
                  type: 'string',
                },
              },
            },
          },
          birth_date: {
            type: 'string',
            format: 'date',
            description: 'Birth date of the customer',
          },
          address: {
            type: 'object',
            properties: {
              street: {
                type: 'string',
              },
              number: {
                type: 'string',
              },
              complement: {
                type: 'string',
              },
              locality: {
                type: 'string',
              },
              city: {
                type: 'string',
              },
              region_code: {
                type: 'string',
              },
              postal_code: {
                type: 'string',
              },
              country: {
                type: 'string',
              },
            },
          },
        },
      },
      Customer: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          reference_id: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
          tax_id: {
            type: 'string',
          },
          phones: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                country: {
                  type: 'string',
                },
                area: {
                  type: 'string',
                },
                number: {
                  type: 'string',
                },
              },
            },
          },
          birth_date: {
            type: 'string',
            format: 'date',
          },
          address: {
            type: 'object',
            properties: {
              street: {
                type: 'string',
              },
              number: {
                type: 'string',
              },
              complement: {
                type: 'string',
              },
              locality: {
                type: 'string',
              },
              city: {
                type: 'string',
              },
              region_code: {
                type: 'string',
              },
              postal_code: {
                type: 'string',
              },
              country: {
                type: 'string',
              },
            },
          },
        },
      },
      Service: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          points: {
            type: 'number',
          },
        },
      },
      Guidance: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
          },
          appServiceId: {
            type: 'string',
            description: 'ID do serviço da aplicação',
          },
          categoryId: {
            type: 'string',
            description: 'ID da categoria do serviço',
          },
          userId: {
            type: 'string',
            description: 'ID do usuário',
          },
          professionalId: {
            type: 'string',
            description: 'ID do profissional',
          },
          title: {
            type: 'string',
            description: 'Título da orientação',
          },
          description: {
            type: 'string',
            description: 'Descrição detalhada da orientação',
          },
          startDate: {
            type: 'string',
            format: 'date-time',
            description: 'Data de início da validade',
          },
          endDate: {
            type: 'string',
            format: 'date-time',
            description: 'Data de fim da validade',
          },
          attachments: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Attachment',
            },
          },
          active: {
            type: 'boolean',
            default: true,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
        required: [
          'appServiceId',
          'categoryId',
          'userId',
          'professionalId',
          'title',
          'description',
          'startDate',
          'endDate',
        ],
      },
      Attachment: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
          },
          fileName: {
            type: 'string',
            description: 'Nome do arquivo',
          },
          fileType: {
            type: 'string',
            description: 'Tipo do arquivo (PDF, imagem, etc.)',
          },
          fileUrl: {
            type: 'string',
            description: 'URL do arquivo',
          },
          fileSize: {
            type: 'number',
            description: 'Tamanho do arquivo em bytes',
          },
          uploadedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de upload do arquivo',
          },
        },
        required: ['fileName', 'fileType', 'fileUrl', 'fileSize'],
      },
      GuidanceCreate: {
        type: 'object',
        properties: {
          appServiceId: {
            type: 'string',
            description: 'ID do serviço da aplicação',
          },
          categoryId: {
            type: 'string',
            description: 'ID da categoria do serviço',
          },
          userId: {
            type: 'string',
            description: 'ID do usuário',
          },
          professionalId: {
            type: 'string',
            description: 'ID do profissional',
          },
          title: {
            type: 'string',
            description: 'Título da orientação',
          },
          description: {
            type: 'string',
            description: 'Descrição detalhada da orientação',
          },
          startDate: {
            type: 'string',
            format: 'date-time',
            description: 'Data de início da validade',
          },
          endDate: {
            type: 'string',
            format: 'date-time',
            description: 'Data de fim da validade',
          },
          attachments: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Attachment',
            },
          },
          active: {
            type: 'boolean',
            default: true,
          },
        },
        required: [
          'appServiceId',
          'categoryId',
          'userId',
          'professionalId',
          'title',
          'description',
          'startDate',
          'endDate',
        ],
      },
      Advertisement: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID único do anúncio',
          },
          professionalId: {
            type: 'string',
            description: 'ID do profissional que criou o anúncio',
          },
          userId: {
            type: 'string',
            description: 'ID do usuário específico (opcional)',
          },
          appointmentId: {
            type: 'string',
            description: 'ID do agendamento relacionado (opcional)',
          },
          appServiceId: {
            type: 'string',
            description: 'ID do serviço relacionado (opcional)',
          },
          title: {
            type: 'string',
            description: 'Título do anúncio',
          },
          description: {
            type: 'string',
            description: 'Descrição detalhada do anúncio',
          },
          targetType: {
            type: 'string',
            enum: ['MY_CLIENTS', 'NON_APPOINTMENT_USERS', 'ALL'],
            description: 'Tipo de público-alvo',
          },
          startDate: {
            type: 'string',
            format: 'date-time',
            description: 'Data de início da validade',
          },
          endDate: {
            type: 'string',
            format: 'date-time',
            description: 'Data de fim da validade',
          },
          attachments: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Attachment',
            },
            description: 'Anexos do anúncio',
          },
          active: {
            type: 'boolean',
            default: true,
            description: 'Status do anúncio',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de criação',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data da última atualização',
          },
        },
        required: ['professionalId', 'title', 'description', 'targetType', 'startDate', 'endDate'],
      },
      AdvertisementInput: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: 'ID do usuário específico (opcional)',
          },
          appointmentId: {
            type: 'string',
            description: 'ID do agendamento relacionado (opcional)',
          },
          appServiceId: {
            type: 'string',
            description: 'ID do serviço relacionado (opcional)',
          },
          title: {
            type: 'string',
            description: 'Título do anúncio',
          },
          description: {
            type: 'string',
            description: 'Descrição detalhada do anúncio',
          },
          targetType: {
            type: 'string',
            enum: ['MY_CLIENTS', 'NON_APPOINTMENT_USERS', 'ALL'],
            description: 'Tipo de público-alvo',
          },
          startDate: {
            type: 'string',
            format: 'date-time',
            description: 'Data de início da validade',
          },
          endDate: {
            type: 'string',
            format: 'date-time',
            description: 'Data de fim da validade',
          },
          attachments: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Attachment',
            },
            description: 'Anexos do anúncio',
          },
          active: {
            type: 'boolean',
            default: true,
            description: 'Status do anúncio',
          },
        },
        required: ['title', 'description', 'targetType', 'startDate', 'endDate'],
      },
      AdvertisementUpdate: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: 'ID do usuário específico (opcional)',
          },
          appointmentId: {
            type: 'string',
            description: 'ID do agendamento relacionado (opcional)',
          },
          appServiceId: {
            type: 'string',
            description: 'ID do serviço relacionado (opcional)',
          },
          title: {
            type: 'string',
            description: 'Título do anúncio',
          },
          description: {
            type: 'string',
            description: 'Descrição detalhada do anúncio',
          },
          targetType: {
            type: 'string',
            enum: ['MY_CLIENTS', 'NON_APPOINTMENT_USERS', 'ALL'],
            description: 'Tipo de público-alvo',
          },
          startDate: {
            type: 'string',
            format: 'date-time',
            description: 'Data de início da validade',
          },
          endDate: {
            type: 'string',
            format: 'date-time',
            description: 'Data de fim da validade',
          },
          attachments: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Attachment',
            },
            description: 'Anexos do anúncio',
          },
          active: {
            type: 'boolean',
            description: 'Status do anúncio',
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
    {
      google: [],
    },
  ],
};
