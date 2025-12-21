const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://krishsi0044_db_user:giudgoJITJWFI0Qw@player.nmqotfg.mongodb.net/?appName=player&connectTimeoutMS=60000&socketTimeoutMS=60000';

const sessionSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    token: String,
    createdAt: Date
});
const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);

const userSchema = new mongoose.Schema({ email: String });
const User = mongoose.models.User || mongoose.model('User', userSchema);

async function check() {
    try {
        await mongoose.connect(MONGODB_URI);

        console.log(`\n====================================`);
        console.log(`  GLOBAL SESSION REPORT`);
        console.log(`====================================`);

        const allSessions = await Session.find().sort({ createdAt: 1 });

        if (allSessions.length === 0) {
            console.log(`\nNo active sessions found for ANY user.`);
        } else {
            // Group by User
            const userMap = {};
            for (const session of allSessions) {
                if (!userMap[session.userId]) {
                    const user = await User.findById(session.userId);
                    userMap[session.userId] = user ? user.email : 'Unknown User';
                }
            }

            console.log(`\nFound ${allSessions.length} total active sessions:\n`);

            allSessions.forEach((s, i) => {
                const age = Math.round((new Date() - s.createdAt) / 1000);
                const userEmail = userMap[s.userId] || 'Unknown';
                console.log(`[${i + 1}] User: ${userEmail.padEnd(30)} | Age: ${age}s | Token: ${s.token.substring(0, 8)}...`);
            });
        }

        console.log(`====================================\n`);

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.connection.close();
    }
}

check();
