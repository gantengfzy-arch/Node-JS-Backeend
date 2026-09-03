const mongoose = require('mongoose');

const dummyUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('DummyUser', dummyUserSchema);