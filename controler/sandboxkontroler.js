const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const DummyUser = require('../models/dummyuser');
const Session = require('../models/session');
const Todo = require('../models/todo');
const { pickSafeFields } = require('../middwere/sanitize');

// 1. Variabel global & default dari .env dideklarasikan di sini agar rapi
const SESSION_MINUTES = Number(process.env.SESSION_MINUTES || 30);
const MAX_SESSIONS = Number(process.env.MAX_SESSIONS || 3);
// Sesuaikan nama variabel dengan .env kamu
const MAX_TODOS = Number(process.env.MAX_TODOS_PER_USER || 3);;

const ramaiMsg = 'Maaf, ruang uji sedang ramai. Silakan tunggu beberapa saat.';

const issueToken = (user, session) => {
    return jwt.sign(
        { id: user._id, sid: session._id, purpose: 'sandbox' },
        process.env.SANDBOX_JWT_SECRET,
        { expiresIn: `${SESSION_MINUTES}m` }
    );
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body || {};
        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ success: false, message: 'Email dan password wajib string.' });
        }

        const user = await DummyUser.findOne({ email: email.toLowerCase().trim() });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Email atau password dummy salah.' });
        }

        await Session.deleteMany({ expiresAt: { $lte: new Date() } });

        let session = await Session.findOne({
            user: user._id,
            expiresAt: { $gt: new Date() }
        });

        if (!session) {
            const active = await Session.countDocuments({ expiresAt: { $gt: new Date() } });
            if (active >= MAX_SESSIONS) {
                return res.status(403).json({ success: false, message: ramaiMsg });
            }
            
            const expiresAt = new Date(Date.now() + SESSION_MINUTES * 60 * 1000);
            session = await Session.create({ user: user._id, expiresAt });
        }

        const token = issueToken(user, session);
        return res.json({
            success: true,
            message: `Masuk sandbox. Token hangus ${SESSION_MINUTES} menit. Jangan isi data sensitif.`,
            data: {
                token,
                expiresAt: session.expiresAt,
                user: { id: user._id, name: user.name, email: user.email },
                rules: {
                    fields: ['title', 'description'],
                    maxTodos: MAX_TODOS,
                    maxSessions: MAX_SESSIONS,
                    sessionMinutes: SESSION_MINUTES
                }
            }
        });
    } catch (err) { next(err); }
};

const exitSandbox = async (req, res, next) => {
    try {
        await Todo.deleteMany({ session: req.sandbox.sessionId });
        await Session.deleteOne({ _id: req.sandbox.sessionId });
        return res.json({ success: true, message: 'Keluar sandbox. Data sesi dihapus.' });
    } catch (err) { next(err); }
};

const getTodos = async (req, res, next) => {
    try {
        const todos = await Todo.find({
            user: req.sandbox.userId,
            session: req.sandbox.sessionId
        }).sort({ createdAt: -1 }).select('title description createdAt updatedAt');
        return res.json({ success: true, message: 'OK', data: todos });
    } catch (err) { next(err); }
};

const createTodo = async (req, res, next) => {
    try {
        const picked = pickSafeFields(req.body);
        if (picked.error) {
            return res.status(400).json({ success: false, message: picked.error });
        }
        if (!picked.title) {
            return res.status(400).json({ success: false, message: 'title wajib diisi.' });
        }

        const count = await Todo.countDocuments({
            user: req.sandbox.userId,
            session: req.sandbox.sessionId
        });
        if (count >= MAX_TODOS) {
            return res.status(400).json({
                success: false,
                message: `Maksimal ${MAX_TODOS} data per sesi.`
            });
        }

        const todo = await Todo.create({
            user: req.sandbox.userId,
            session: req.sandbox.sessionId,
            title: picked.title,
            description: picked.description,
            expiresAt: req.sandbox.expiresAt
        });
        return res.status(201).json({
            success: true,
            message: 'Catatan sandbox dibuat.',
            data: { _id: todo._id, title: todo.title, description: todo.description }
        });
    } catch (err) { next(err); }
};

const updateTodo = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id || !id.match(/^[a-fA-F0-9]{24}$/)) {
            return res.status(400).json({ success: false, message: 'ID tidak valid.' });
        }
        if (req.body?.title !== undefined && typeof req.body.title !== 'string') {
            return res.status(400).json({ success: false, message: 'title harus string.' });
        }
        if (req.body?.description !== undefined && typeof req.body.description !== 'string') {
            return res.status(400).json({ success: false, message: 'description harus string.' });
        }

        const picked = pickSafeFields({
            title: req.body?.title ?? '',
            description: req.body?.description ?? ''
        });

        const todo = await Todo.findOne({
            _id: id,
            user: req.sandbox.userId,
            session: req.sandbox.sessionId
        });
        if (!todo) {
            return res.status(404).json({ success: false, message: 'Data tidak ditemukan.' });
        }
        if (req.body?.title !== undefined) todo.title = picked.title || todo.title;
        if (req.body?.description !== undefined) todo.description = picked.description;
        await todo.save();
        return res.json({
            success: true,
            message: 'Diperbarui.',
            data: { _id: todo._id, title: todo.title, description: todo.description }
        });
    } catch (err) { next(err); }
};

const deleteTodo = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id || !id.match(/^[a-fA-F0-9]{24}$/)) {
            return res.status(400).json({ success: false, message: 'ID tidak valid.' });
        }
        const todo = await Todo.findOneAndDelete({
            _id: id,
            user: req.sandbox.userId,
            session: req.sandbox.sessionId
        });
        if (!todo) {
            return res.status(404).json({ success: false, message: 'Data tidak ditemukan.' });
        }
        return res.json({ success: true, message: 'Dihapus.', data: null });
    } catch (err) { next(err); }
};

module.exports = { login, exitSandbox, getTodos, createTodo, updateTodo, deleteTodo };