// server.js
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = "mongodb+srv://freelancedb:SlDx8nSQrY01VCsN@cluster0.fbisr7m.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get('/', (req, res) => {
  res.send('Freelance MarketPlace is running');
});

async function run() {
  try {
    await client.connect();
    const db = client.db('freelancedb');

    // Collections
    const freelanceCollection = db.collection("freelance");
    const acceptedTasksCollection = db.collection("acceptedTasks");

   
    app.post('/freelance', async (req, res) => {
      const newJob = req.body;
      const result = await freelanceCollection.insertOne(newJob);
      res.send(result);
    });

    // Get all freelance jobs
    app.get('/freelance', async (req, res) => {
      const cursor = freelanceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get jobs by user email
    app.get('/freelance/:email', async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const result = await freelanceCollection.find(query).toArray();
      res.send(result);
    });

    // Get single job by id
    app.get('/freelance/job/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await freelanceCollection.findOne(query);
      res.send(result);
    });

    // Update a job
    app.patch('/freelance/:id', async (req, res) => {
      const id = req.params.id;
      const updatedJob = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          title: updatedJob.title,
          postedBy: updatedJob.postedBy,
          category: updatedJob.category,
          summary: updatedJob.summary,
          coverImage: updatedJob.coverImage,
          userEmail: updatedJob.userEmail,
        },
      };
      const result = await freelanceCollection.updateOne(query, update);
      res.send(result);
    });

    // Delete a job
    app.delete('/freelance/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await freelanceCollection.deleteOne(query);
      res.send(result);
    });

    // ========================
    // Accepted Tasks routes
    // ========================

    // Add new accepted task (যখন কেউ accept করবে)
    app.post('/acceptedTasks', async (req, res) => {
      const newTask = req.body;
      const result = await acceptedTasksCollection.insertOne(newTask);
      res.send(result);
    });

    // Get accepted tasks by user email
    app.get('/acceptedTasks', async (req, res) => {
      const userEmail = req.query.userEmail;
      if (!userEmail) return res.status(400).send({ error: "userEmail query param is required" });
      const query = { userEmail };
      const result = await acceptedTasksCollection.find(query).toArray();
      res.send(result);
    });

    // Delete accepted task (for DONE or CANCEL)
    app.delete('/acceptedTasks/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await acceptedTasksCollection.deleteOne(query);
      res.send(result);
    });

    // Ping DB
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB successfully!");
  } finally {
    // no cleanup needed
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`🚀 Freelance MarketPlace backend running on port ${port}`);
});
