const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://krishsi0044_db_user:giudgoJITJWFI0Qw@player.nmqotfg.mongodb.net/?appName=player';

async function testConnection() {
    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connection Successful!');

        // Test creating a mock user
        console.log('Defining schema...');
        const TestSchema = new mongoose.Schema({ name: String });
        const TestModel = mongoose.model('TestConnection', TestSchema);

        console.log('Creating document...');
        await TestModel.create({ name: 'Connection Test' });
        console.log('✅ Document created successfully!');

        await mongoose.connection.close();
        console.log('Connection closed.');
    } catch (error) {
        console.error('❌ Connection Failed:', error);
    }
}

testConnection();
