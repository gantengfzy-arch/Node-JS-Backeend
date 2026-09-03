const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'DummyUser', required: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'SandboxSession', required: true },
    title: { type: String, required: true, maxlength: 120 },
    description: { type: String, default: '', maxlength: 1000 },
    expiresAt: { type: Date, required: true }
}, { timestamps: true });

todoSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const SandboxTodo = mongoose.model('SandboxTodo', todoSchema);
SandboxTodo.syncIndexes();

module.exports = SandboxTodo;