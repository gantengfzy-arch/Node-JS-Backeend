require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const { connectSandbox } = require('./config/config');
const swaggerSpec = require('./config/swagger');
const sandboxRoutes = require('./routes/sandboxroutes');
const { seedDummyUsers } = require('./seed');

const app = express();
const PORT = process.env.PORT || 5001;

// Site Key Testing Bawaan Google (Ganti dengan process.env.RECAPTCHA_SITE_KEY di production)
const SITE_KEY = process.env.RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
const SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';

// Middleware Dasar
app.use(cors({ origin: true }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true })); // Wajib untuk membaca data form dari halaman gate
app.use(cookieParser());

// HTML Halaman Gerbang (Gate)
const gateHTML = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gerbang Keamanan - Fortress Sandbox</title>
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #0f172a; color: #f8fafc; margin: 0; }
        .card { background: #1e293b; padding: 35px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); text-align: center; max-width: 400px; width: 90%; border: 1px solid #334155; }
        h2 { margin-top: 0; color: #38bdf8; }
        p { color: #94a3b8; font-size: 14px; margin-bottom: 25px; line-height: 1.5; }
        .captcha-container { display: flex; justify-content: center; margin-bottom: 20px; }
        button { width: 100%; padding: 12px; background: #0284c7; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.2s; }
        button:hover { background: #0369a1; }
    </style>
</head>
<body>
    <div class="card">
        <h2>Fortress Sandbox</h2>
        <p>Silakan selesaikan tantangan reCAPTCHA untuk membuka dokumentasi API Swagger.</p>
        <form action="/verify-gate" method="POST">
            <div class="captcha-container">
                <div class="g-recaptcha" data-sitekey="${SITE_KEY}"></div>
            </div>
            <button type="submit">Buka Sandbox Docs</button>
        </form>
    </div>
</body>
</html>
`;

// Middleware Begal Swagger
const swaggerGate = (req, res, next) => {
    if (req.cookies && req.cookies.captcha_passed === 'true') {
        return next(); // Lolos, tampilkan Swagger
    }
    res.send(gateHTML); // Belum verifikasi, tahan di gerbang
};

// Endpoint Proses Verifikasi Gerbang
app.post('/verify-gate', async (req, res) => {
    const token = req.body['g-recaptcha-response'];

    if (!token) {
        return res.send('CAPTCHA wajib dicentang! <a href="/sandbox-docs">Coba Lagi</a>');
    }

    try {
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${SECRET_KEY}&response=${token}`
        });

        const data = await response.json();

        if (data.success) {
            // Set cookie berlaku selama 1 jam
            res.cookie('captcha_passed', 'true', { maxAge: 3600000, httpOnly: true });
            return res.redirect('/sandbox-docs');
        } else {
            return res.send('Verifikasi CAPTCHA gagal! <a href="/sandbox-docs">Coba Lagi</a>');
        }
    } catch (err) {
        res.status(500).send('Terjadi kesalahan pada verifikasi server.');
    }
});

// Swagger Route (Dibegal oleh swaggerGate)
app.use(
    '/sandbox-docs',
    swaggerGate,
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        customSiteTitle: 'Fortress Sandbox',
        swaggerOptions: { persistAuthorization: true }
    })
);

app.use('/api/sandbox', sandboxRoutes);

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Fortress Sandbox API',
        docs: '/sandbox-docs'
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('SANDBOX ERROR:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Server error'
    });
});

const start = async () => {
    await connectSandbox();
    await seedDummyUsers();
    app.listen(PORT, () => {
        console.log(`Sandbox API  → http://localhost:${PORT}`);
        console.log(`Swagger docs → http://localhost:${PORT}/sandbox-docs (Proteksi CAPTCHA Aktif)`);
    });
};

start();