const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const port = 5000;
const ObjectId = require('mongodb').ObjectId;

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0fkav.mongodb.net/${process.env.DB_HOST}?retryWrites=true&w=majority`;

app.use(express.json());
app.use(cors());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const serviceCollection = client.db("carServe").collection("automobileService");
  const reviewCollection = client.db("carServe").collection("userReviews");
  const userOrderedCollection = client.db("carServe").collection("userOrders");

  app.get('/services', (req, res)=>{
    serviceCollection.find()
    .toArray((err, items) => {
      res.send(items)
      console.log('from database', items);
    })
  })

  app.post('/addService', (req, res)=>{
      const addedService = req.body;
      console.log(addedService);
      serviceCollection.insertOne(addedService)
      .then(result =>{
          res.send(result.insertedCount > 0)
      })
  })

  app.get('/reviews', (req, res)=>{
  reviewCollection.find()
  .toArray((err, data) => {
    res.send(data)
    console.log('from database', data);
  })
})

app.post('/addReview', (req, res)=>{
    const addedReview = req.body;
    console.log(addedReview);
    reviewCollection.insertOne(addedReview)
    .then(result =>{
        res.send(result.insertedCount > 0)
    })
})

app.post('/addOrderedServices', (req, res)=>{
  const addedOrder = req.body;
  console.log(addedOrder);
  userOrderedCollection.insertOne(addedOrder)
  .then(result =>{
      res.send(result.insertedCount > 0)
  })
})

app.get('/userBookings', (req, res)=>{
  userOrderedCollection.find({email:req.query.email})
  .toArray((err, bookings) => {
    res.send(bookings)
    console.log('from database', bookings);
  })
})

app.get('/userBookingsForAdmin', (req, res)=>{
  userOrderedCollection.find()
  .toArray((err, allBookings) => {
    res.send(allBookings)
    console.log('from database', allBookings);
  })
})



app.delete('/delete/:id', (req, res)=>{
  serviceCollection.deleteOne({_id: ObjectId(req.params.id)})
  .then(result => {
    console.log(result)
  })
    console.log(req.params.id);
})

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)