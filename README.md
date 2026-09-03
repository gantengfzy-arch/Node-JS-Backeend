# 🛡️ Fortress Sandbox API

API backend interaktif yang dibangun menggunakan Node.js dan Express, dirancang secara khusus untuk dieksekusi di atas arsitektur **Vercel Serverless**. Proyek ini dilengkapi dengan dokumentasi Swagger UI yang diproteksi menggunakan sistem gerbang **Google reCAPTCHA v2** dan terhubung ke MongoDB Atlas secara *on-demand*.

## Daftar Isi
- [Fitur](#fitur)
- [Teknologi yang Dipakai](#teknologi-yang-dipakai)
- [Struktur Project](#struktur-project)
- [Persyaratan](#persyaratan)
- [Instalasi](#instalasi)
- [Environment Variables](#environment-variables)
- [Menjalankan Project](#menjalankan-project)
- [Dokumentasi API](#dokumentasi-api)
- [Referensi Endpoint Singkat](#referensi-endpoint-singkat)
- [Kebijakan Area Sandbox](#kebijakan-area-sandbox)
- [Lisensi](#lisensi)

---

## Fitur

* **Arsitektur Serverless Vercel**: Konfigurasi khusus `vercel.json` dan ekspor modul yang dioptimalkan untuk *serverless function*.
* **Proteksi Gerbang reCAPTCHA**: Akses ke dokumentasi API ditahan oleh halaman statis reCAPTCHA v2 berbasis validasi sesi/cookie.
* **On-Demand Database Connection**: *Middleware* khusus untuk menyuntikkan koneksi MongoDB Atlas guna mengatasi isu *cold-start* di Vercel.
* **CDN-Based Swagger Assets**: Resolusi aset statis (CSS/JS) Swagger UI dialihkan menggunakan CDN untuk mencegah error 404 saat *deployment*.
* **Seed Data Otomatis**: Injeksi *dummy users* saat server pertama kali dijalankan (khusus mode lokal).
* **Global Error Handling**: Tangkapan *error* terpusat dengan *status code* dan format *response* yang konsisten.

---

## Teknologi yang Dipakai

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB Atlas (Mongoose ODM)
* **Keamanan:** Google reCAPTCHA API, CORS, Cookie Parser
* **Dokumentasi:** swagger-jsdoc, swagger-ui-express
* **Deployment:** Vercel (Production)

---

## Struktur Project

```text
.
├── config/ 
│   ├── config.js          # Pengelola koneksi MongoDB Atlas
│   └── swagger.js         # Konfigurasi OpenAPI 3.0 & Base URL Servers
├── routes/ 
│   └── sandboxroutes.js   # Definisi endpoint (Login, Todos, Exit)
├── seed.js                # Seeder untuk data dummy awal
├── server.js              # Entry point aplikasi & logika gerbang reCAPTCHA
├── vercel.json            # Konfigurasi routing Vercel Serverless
└── package.json           # Dependensi project

```

---

## Persyaratan

Sebelum menjalankan project ini di komputer lokal, pastikan sudah terinstall:

* **Node.js**: Versi 18 ke atas
* **Akun MongoDB Atlas**: Database Cloud
* **Akun Google reCAPTCHA v2**: Untuk mendapatkan Site Key & Secret Key

### Minimum Requirements

Pastikan environment pengembangan memenuhi spesifikasi minimum berikut:

| Software | Versi Minimum |
| --- | --- |
| **Node.js** | 18.x |
| **npm** | 9.x |
| **MongoDB** | Atlas Cloud (M0 Free Tier) |
| **RAM** | 2 GB |

Sistem operasi yang didukung:

* Windows 10/11
* Linux (Ubuntu 22.04+ direkomendasikan)
* macOS 12+

---

## Instalasi

```bash
# Clone repositori
git clone [https://github.com/username-kamu/node-js-backeend.git](https://github.com/username-kamu/node-js-backeend.git)
cd node-js-backeend

# Install dependensi
npm install

```

---

## Environment Variables

Salin file `.env.example` menjadi `.env` (atau buat file `.env` baru), lalu sesuaikan nilainya. Jika kamu men-deploy ke Vercel, masukkan variabel ini di menu **Settings > Environment Variables** pada dashboard Vercel.

| Variable | Wajib | Contoh Nilai | Keterangan |
| --- | --- | --- | --- |
| `PORT` | Tidak | `5001` | Port server lokal, default `5001` |
| `DB` | Ya | `mongodb+srv://.../Sandbox` | Connection string MongoDB Atlas |
| `RECAPTCHA_SITE_KEY` | Ya | `6LeIxAcTAAAAA...` | Kunci publik Google reCAPTCHA v2 |
| `RECAPTCHA_SECRET_KEY` | Ya | `6LeIxAcTAAAAA...` | Kunci rahasia Google reCAPTCHA v2 |
| `JWT_SECRET` | Ya | `string_rahasia` | Secret key untuk token sandbox jika ada |

---

## Menjalankan Project

### Mode Development (Lokal)

```bash
node server.js
# atau
npm start

```

Server akan berjalan di `http://localhost:5001`. Koneksi ke database dan seeder data otomatis dieksekusi di mode ini.

### Mode Production (Vercel)

Project ini siap di-*deploy* langsung ke Vercel. Cukup import *repository* ini di dashboard Vercel, masukkan Environment Variables, lalu deploy. Konfigurasi Serverless dikelola otomatis oleh file `vercel.json` dan `module.exports = app` di akhir `server.js`.

---

## Dokumentasi API

Dokumentasi interaktif (Swagger UI) dapat diakses di:

* **Lokal:** `http://localhost:5001/sandbox-docs`
* **Production:** `https://<domain-vercel-kamu>.vercel.app/sandbox-docs`

*(Catatan: Kamu harus menyelesaikan tantangan reCAPTCHA terlebih dahulu untuk bisa masuk ke halaman ini).*

---

## Referensi Endpoint Singkat

Base path API: `/api/sandbox`

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| `POST` | `/login` | Autentikasi dummy, mengembalikan `sandboxToken` |
| `POST` | `/exit` | Keluar dan hapus data sesi |
| `GET` | `/todos` | Mengambil list catatan (max 3 item) |
| `POST` | `/todos` | Menambah catatan baru (membutuhkan title & description) |

Untuk detail lengkap setiap endpoint (skema request, header CORS, contoh response), lihat dokumentasi Swagger setelah berhasil melewati gerbang keamanan.

---

## Kebijakan Area Sandbox

---

## Lisensi

Project ini dirilis di bawah lisensi MIT License.

Dikelola dan dikembangkan untuk eksplorasi teknologi *backend Node.js* dan infrastruktur *Serverless*.

```

```
