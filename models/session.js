const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'DummyUser', 
        required: true 
    },
    expiresAt: { 
        type: Date, 
        required: true,
        expires: 0 
    }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);