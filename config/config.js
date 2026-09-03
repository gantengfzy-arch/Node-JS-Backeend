const mongoose = require('mongoose');

const connectSandbox = async () => {
    const uri = process.env.DB;
    if (!uri) throw new Error('DB belum di-set di file .env');

    await mongoose.connect(uri, {
        dbName: 'Sandbox'
    });

    console.log('MongoDB connected → cluster OK | database:', mongoose.connection.name);
};

module.exports = { connectSandbox };