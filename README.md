# Fortress Sandbox API

API backend siap pakai yang dibangun dengan **Node.js**, **Express**, dan **MongoDB Atlas**. Proyek ini dilengkapi dengan dokumentasi interaktif **Swagger UI** yang diproteksi oleh gerbang keamanan **Google reCAPTCHA v2** dan di-deploy pada arsitektur *serverless* **Vercel**.

---

## 🚀 Fitur Utama

* **RESTful API Service:** Arsitektur modular dan terstruktur untuk penanganan *request* data.
* **Database Cloud:** Terintegrasi langsung dengan MongoDB Atlas secara *on-demand*.
* **Interactive API Docs:** Dokumentasi Swagger UI interaktif untuk kemudahan evaluasi dan pengujian endpoint.
* **reCAPTCHA Protection Gate:** Proteksi akses dokumentasi menggunakan Google reCAPTCHA v2 (Checkbox) berbasis *cookie-session*.
* **Serverless Ready:** Konfigurasi khusus `vercel.json` dan penanganan fungsi *serverless* tanpa dependensi *process listener* persisten.

---

## 🛠️ Perkakas & Teknologi

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB Atlas (Mongoose ODM)
* **Dokumentasi:** Swagger UI Express & Swagger JSDoc
* **Keamanan:** Google reCAPTCHA v2, Cookie Parser, CORS
* **Deployment Platform:** Vercel (Serverless Functions)

---

## 📁 Struktur Proyek

```text
.
├── config/
│   ├── config.js          # Konfigurasi koneksi MongoDB
│   └── swagger.js         # Konfigurasi OpenAPI / Swagger JSDoc
├── routes/
│   └── sandboxroutes.js   # Definition & Handler route API
├── seed.js                # Seeder data dummy awal
├── server.js              # Entrypoint Express & middleware gerbang security
├── vercel.json            # Konfigurasi routing Vercel Serverless
├── package.json
└── README.md
