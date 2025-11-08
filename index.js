const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://freelancedb:SlDx8nSQrY01VCsN@cluster0.fbisr7m.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get('/', (req, res) => {
    res.send('Freelance MarketPlace is running')
})

async function run() {
    try {
        await client.connect();

        const db = client.db('freelancedb');
        const freelanceCollection = db.collection("freelance")

        // Freelance MarketPlace
        app.post('/freelance', async (req, res) => {
            const newFreelance = req.body;
            const result = await freelanceCollection.insertOne(newFreelance);
            res.send(result);

        })

        app.get('/freelance', async (req, res) => {
            const cursor = freelanceCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/freelance/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await freelanceCollection.findOne(query);
            res.send(result);
        })

        app.patch('/freelance/:id', async (req, res) => {
            const id = req.params.id;
            const updatedFreelance = req.body;
            const query = { _id: new ObjectId(id) }
            const update = {
                $set: {
                    title: updatedJob.title,
                    postedBy: updatedJob.postedBy,
                    category: updatedJob.category,
                    summary: updatedJob.summary,
                    coverImage: updatedJob.coverImage,
                    userEmail: updatedJob.userEmail
                }
            }
            const result = await freelanceCollection.updateOne(query, update)
            res.send(result);
        });

        // Delete
        app.delete('/freelance/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await freelanceCollection.deleteOne(query); res.send(result);
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    }
    finally {

    }
}

run().catch(console.dir)
app.listen(port, () => {
    console.log(`Freelance MarketPlace is running on port: ${port}`)
})
