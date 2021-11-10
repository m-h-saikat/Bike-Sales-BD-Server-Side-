const express = require("express");
require("dotenv").config();
const app = express();
const port =  5000;
const { MongoClient } = require("mongodb");
const objectId = require("mongodb").ObjectId;
const corse = require("cors");


// User Id & Password
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.od1ig.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;



// middleware
app.use(corse());
app.use(express.json());

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


async function run() {
  try {
    // Craete Database and Collection
    // as package is a reserve word so that use service as a package
    await client.connect();
    const database = client.db("BikeSalesBD");
    const servicesCollection = database.collection("services");
    const usersCollection = client.db("BikeSalesBD").collection("users");
  const ordersCollection = client.db("BikeSalesBD").collection("orders");
  const reviewCollection = client.db("BikeSalesBD").collection("reviews");

    app.get("/", (req, res) => {
      res.send("Running BikeSalesBD server");
    });


     // Send Bike  Data in Database
     app.post("/services", async (req, res) => {
      const service = req.body;
        console.log("Send the Data in Database", service);
      const result = await servicesCollection.insertOne(service);
      res.send(result);
    });

 // Send Review  Data in Database
 app.post("/reviews", async (req, res) => {
  const review = req.body;
  const result = await reviewCollection.insertOne(review);
  res.send(result);
});

    
   // Get All reviews
   app.get("/reviews", async (req, res) => {
    const cursor = reviewCollection.find({});
    const reviews = await cursor.toArray();
    res.send(reviews);
  });


    // Get All services
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

 //  make admin

 app.put("/makeAdmin", async (req, res) => {
  const filter = { email: req.body.email };
  const result = await usersCollection.find(filter).toArray();
  if (result) {
    const documents = await usersCollection.updateOne(filter, {
      $set: { role: "admin" },
    });
    console.log(documents);
  }

});

// Post USer Info 
app.post("/addUserInfo", async (req, res) => {
  console.log("req.body");
  const result = await usersCollection.insertOne(req.body);
  res.send(result);
  console.log(result);
});

// check admin or not
app.get("/checkAdmin/:email", async (req, res) => {
  const result = await usersCollection
    .find({ email: req.params.email })
    .toArray();
  console.log(result);
  res.send(result);
});




    //   Get Service Details
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("get 1 Service id", id);
      const query = { _id: objectId(id) };
      const service = await servicesCollection.findOne(query);

      res.json(service);
    });

    app.listen(port, () => {
      console.log("Running BikeSalesBD server on port", port);
    });

   
    //Delete any Package
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
  }
}
run().catch(console.dir);