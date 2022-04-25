const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, Collection } = require("mongodb");

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.8sj9d.mongodb.net/ema-jhon?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// client.connect((err) => {
//   const collection = client.db("emJhon").collection("products");
//   console.log("mongo is connected");
//   // perform actions on the collection object
//   client.close();
// });

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("ema-jhon").collection("product");

    app.get("/product", async (req, res) => {
      console.log("query : ", req.query);
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const query = {};
      const cursor = productCollection.find(query);
      // const products = await cursor.limit(10).toArray();
      let products;
      if (page || size) {
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        products = await cursor.toArray();
      }

      res.send(products);
    });

    app.get("/productCount", async (req, res) => {
      const count = await productCollection.estimatedDocumentCount();
      // res.json(count);
      res.send({ count });
    });

    // use post to get products
    app.post("/productsByKeys", async (req, res) => {
      // const keys = req.body;
      // const ids = keys.map((id) => ObjectId(id));
      // const query = { _id: { $in: ids } };
      // const cursor = productCollection.find(query);
      // const products = await cursor.toArray();
      // console.log(keys);
      // res.send(products);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Ema is running and waiting for ema");
});

app.listen(port, () => {
  console.log("jon is running on port", port);
});
