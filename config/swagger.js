const swaggerJsdoc = require('swagger-jsdoc');

const spec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Fortress Sandbox API',
            version: '1.0.0',
            description:
                'Ruang uji. Hanya title + description. Max 3 data. Sesi 30 menit. Max 3 user. Token sandbox (bukan JWT Fortress). Jangan isi data sensitif.'
        },
        servers: [
            {
                url: process.env.API_PUBLIC_URL || 'http://localhost:5001/api',
                description: 'Sandbox'
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{ BearerAuth: [] }]
    },
    apis: ['./routes/sandboxroutes.js']
});

module.exports = spec;