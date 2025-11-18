
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use('/images', express.static('uploads')); 


const uri = "mongodb+srv://freelancedb:SlDx8nSQrY01VCsN@cluster0.fbisr7m.mongodb.net/?appName=Cluster0";
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
    const db = client.db('freelancedb');
    const freelanceCollection = db.collection("freelance");
    


    



   
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
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          title: updatedJob.title,
          category: updatedJob.category,
          postedBy: updatedJob.postedBy,
          summary: updatedJob.summary,
          coverImage: updatedJob.coverImage,
        },
      };
      try {
        const result = await freelanceCollection.updateOne(query, updateDoc);
        if (result.modifiedCount > 0) {
          res.send({ success: true, message: "Job updated successfully!" });
        } else {
          res.status(404).send({ success: false, message: "Job not found" });
        }
      } catch (error) {
        console.error("❌ Error updating job:", error);
        res.status(500).send({ success: false, message: "Failed to update job" });
      }
    });

    
    app.delete('/freelance/:id', async (req, res) => {
      const id = req.params.id;
      const result = await freelanceCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB successfully!");
  } finally {
    
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`🚀 Backend running on port ${port}`);
});






