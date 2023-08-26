const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const app = express();
const port = 8000;

// middlewares
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("VRHUB server is running");
});

// -----------------------------------------------

const uri =
  "mongodb+srv://vrhub:C4Kyhxzf20ItNQcu@cluster0.z0kccsz.mongodb.net/?retryWrites=true&w=majority";

// create client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// admin collection
const adminCollection = client.db("vrhub").collection("admin");

// blogs collection
const blogsCollection = client.db("vrhub").collection("blogs");

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    // -----------------------------------------------

    // create admin
    app.post("/api/v1/createAdmin", async (req, res) => {
      const newAdmin = req.body;
      const result = await adminCollection.insertOne(newAdmin);
      console.log("new admin added", result);
      res.json(result);
    });

    // get admin
    app.get("/api/v1/getAdmin", async (req, res) => {
      const cursor = adminCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    // admin login
    app.post("/api/v1/adminLogin", async (req, res) => {
      const admin = req.body;
      const result = await adminCollection.findOne({
        email: admin.email,
        password: admin.password,
      });
      res.json(result);
    });

    // -----------------------------------------------

    // create blog
    app.post("/api/v1/createBlog", async (req, res) => {
      const newBlog = req.body;
      const result = await blogsCollection.insertOne(newBlog);
      console.log("new blog added", result);
      res.json(result);
    });

    // get all blogs
    app.get("/api/v1/getBlogs", async (req, res) => {
      const cursor = blogsCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    // -----------------------------------------------

    console.log("MongoDB Connected!");
  } finally {
  }
}
run().catch(console.dir);

// -----------------------------------------------
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
