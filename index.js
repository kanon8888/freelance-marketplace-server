const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/images', express.static('uploads')); 


const uri =
  "mongodb+srv://freelancedb:SlDx8nSQrY01VCsN@cluster0.fbisr7m.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("freelancedb");

    const freelanceCollection = db.collection("freelance");
    const acceptedTasksCollection = db.collection("acceptedTasks");

    console.log("✅ Connected to MongoDB");

   
    app.get('/freelance', async (req, res) => {
      const jobs = await freelanceCollection.find().toArray();
      res.send(jobs);
    });

    app.get('/freelance/:id', async (req, res) => {
      const id = req.params.id;
      const job = await freelanceCollection.findOne({ _id: new ObjectId(id) });
      res.send(job);
    });

    app.post('/freelance', async (req, res) => {
      const job = req.body;
      const result = await freelanceCollection.insertOne(job);
      res.send(result);
    });

    app.put('/freelance/:id', async (req, res) => {
      const id = req.params.id;
      const updatedJob = req.body;

      const result = await freelanceCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            title: updatedJob.title,
            category: updatedJob.category,
            postedBy: updatedJob.postedBy,
            summary: updatedJob.summary,
            coverImage: updatedJob.coverImage,
          },
        }
      );

      if (result.modifiedCount > 0) {
        res.send({ success: true });
      } else {
        res.send({ success: false });
      }
    });

    app.delete('/freelance/:id', async (req, res) => {
      const id = req.params.id;
      const result = await freelanceCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });


   
    app.get("/acceptedTasks", async (req, res) => {
      const userEmail = req.query.userEmail;

      if (!userEmail) {
        return res.status(400).send({ error: "userEmail missing" });
      }

      const tasks = await acceptedTasksCollection.find({ userEmail }).toArray();
      res.send(tasks);
    });

   
    app.post("/acceptedTasks", async (req, res) => {
      const task = req.body;

      if (!task.userEmail) {
        return res.status(400).send({ error: "userEmail missing in task" });
      }

      const result = await acceptedTasksCollection.insertOne(task);
      res.send(result);
    });

    app.post("/acceptedTasks", async (req, res) => {
  const task = req.body;
  const result = await acceptedTasksCollection.insertOne(task);
  res.send(result);
});


   
    app.delete("/acceptedTasks/:id", async (req, res) => {
      const id = req.params.id;

      const result = await acceptedTasksCollection.deleteOne({
        _id: new ObjectId(id),
      });

      res.send({ success: result.deletedCount > 0 });
    });
  } catch (error) {
    console.error(" ERROR:", error);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(` Backend running on port ${port}`);
});













