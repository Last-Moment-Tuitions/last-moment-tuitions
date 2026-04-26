const { MongoClient, ObjectId } = require('mongodb');

async function checkTemplate() {
    const uri = "mongodb://localhost:27017/tuitions"; // Guessed from context
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db("tuitions");
        const pages = db.collection("pages");
        
        const templateId = "69bedd85babf20277b80c00639a60a20";
        const template = await pages.findOne({ _id: new ObjectId(templateId) });
        
        if (template) {
        } else {
            
            // Try searching by slug
            const bySlug = await pages.findOne({ slug: 'lmt-testimonials' });
            if (bySlug) {
            }
        }
    } catch (e) {
    } finally {
        await client.close();
    }
}

checkTemplate();
