const bcrypt = require('bcryptjs');
const DummyUser = require('./models/dummyuser');

const seedDummyUsers = async () => {
    const password = process.env.DUMMY_PASSWORD || 'sandbox123';
    const hash = await bcrypt.hash(password, 10);
    const accounts = [
        { name: 'Sandbox 1', email: 'sandbox1@fortress.lab' },
        { name: 'Sandbox 2', email: 'sandbox2@fortress.lab' },
        { name: 'Sandbox 3', email: 'sandbox3@fortress.lab' }
    ];
    for (const acc of accounts) {
        const exists = await DummyUser.findOne({ email: acc.email });
        if (!exists) {
            await DummyUser.create({ ...acc, password: hash });
            console.log('Seed dummy:', acc.email);
        }
    }
};

if (require.main === module) {
    require('dotenv').config();
    const { connectSandbox } = require('./config/db');
    connectSandbox()
        .then(seedDummyUsers)
        .then(() => process.exit(0))
        .catch((e) => { console.error(e); process.exit(1); });
}

module.exports = { seedDummyUsers };