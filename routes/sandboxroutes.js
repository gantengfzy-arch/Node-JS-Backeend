const express = require('express');
const router = express.Router();
const { sandboxAuth } = require('../middwere/sandboxAuth');
const {
    login, exitSandbox, getTodos, createTodo, updateTodo, deleteTodo
} = require('../controler/sandboxkontroler');

/**
 * @swagger
 * /sandbox/login:
 *   post:
 *     tags: [Sandbox]
 *     summary: Login akun dummy
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: sandbox1@fortress.lab }
 *               password: { type: string, example: sandbox123s }
 *     responses:
 *       200: { description: sandboxToken }
 *       403: { description: Ruang uji ramai }
 */
router.post('/login', login);

/**
 * @swagger
 * /sandbox/exit:
 *   post:
 *     tags: [Sandbox]
 *     summary: Keluar dan hapus data sesi
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200: { description: OK }
 */
router.post('/exit', sandboxAuth, exitSandbox);

/**
 * @swagger
 * /sandbox/todos:
 *   get:
 *     tags: [Sandbox]
 *     summary: List catatan (max 3)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200: { description: OK }
 *   post:
 *     tags: [Sandbox]
 *     summary: Tambah catatan (title + description saja)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string, example: Catatan saya }
 *               description: { type: string, example: Isi catatan }
 *     responses:
 *       201: { description: Dibuat }
 *       400: { description: Limit atau input salah }
 */
router.get('/todos', sandboxAuth, getTodos);
router.post('/todos', sandboxAuth, createTodo);

/**
 * @swagger
 * /sandbox/todos/{id}:
 *   put:
 *     tags: [Sandbox]
 *     summary: Update title/description
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: 64abc123def456789012345
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string, example: Judul baru }
 *               description: { type: string, example: Isi baru }
 *     responses:
 *       200: { description: Diperbarui }
 *       404: { description: Tidak ditemukan }
 *   delete:
 *     tags: [Sandbox]
 *     summary: Hapus satu catatan
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: 64abc123def456789012345
 *     responses:
 *       200: { description: Dihapus }
 *       404: { description: Tidak ditemukan }
 */
router.put('/todos/:id', sandboxAuth, updateTodo);
router.delete('/todos/:id', sandboxAuth, deleteTodo);

module.exports = router;