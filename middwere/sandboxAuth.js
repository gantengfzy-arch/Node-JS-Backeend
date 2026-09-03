const jwt = require('jsonwebtoken');
const Session = require('../models/session');
const Todo = require('../models/todo');

const SESSION_MINUTES = Number(process.env.SESSION_MINUTES || 30);

const sandboxAuth = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({ succes: false, message: 'Token sandbox tidak ada.' });
        }
        const token = header.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SANDBOX_JWT_SECRET);
        if (decoded.purpose !== 'sandbox') {
            return res.status(403).json({ succes: false, message: 'Token bukan sandbox token.' });
        }

        const session = await Session.findById(decoded.sid);
        if (!session || session.expiresAt.getTime() < Date.now()) {
            if (session) {
                await Todo.deleteMany({ session: session._id });
                await Session.deleteOne({ _id: session._id });
            }
            return res.status(401).json({ succes: false, message: 'Sesi habis. Login dummy lagi.' });
        }

        req.sandbox = {
            userId: decoded.id,
            sessionId: session._id,
            expiresAt: session.expiresAt
        };
        next();
    } catch (err) {
        return res.status(401).json({ succes: false, message: 'Token sandbox tidak valid atau kadaluarsa.' });
    }
};

module.exports = { sandboxAuth, SESSION_MINUTES };