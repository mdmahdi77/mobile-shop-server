const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectId
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()


const port = process.env.PORT || 6066

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h25va.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("mobileShopData").collection("productData");
  const orderCollection = client.db("mobileShopData").collection("order");

  app.post('/addProducts', (req, res) => {
    const products = req.body
    productCollection.insertOne(products)
    .then( result => {
      res.send(result.insertedCount)
    })
  })

  app.get('/products', (req, res) => {
    productCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.post('/addEvents', (req, res) => {
    const newEvent = req.body
      console.log('adding newEvent', newEvent)
      productCollection.insertOne(newEvent)
      .then(result => {
        console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0)
    })
  })

  app.post('/addOrders', (req, res) => {
    const orders = req.body
    orderCollection.insertOne(orders)
    .then( result => {
      console.log(result)
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/orders', (req, res) => {
    console.log(req.query.email)
    orderCollection.find({email: req.query.email})
    .toArray((err, documents) => {
      res.send(documents)
      console.log(documents)
    })
  })
  
});




app.listen(process.env.PORT || port)