const express  = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.elw8g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('car-commerce');
        const carsCollection = database.collection('cars');
        const ordersCollection = database.collection('orders');
        const usersCollection = database.collection('users');
        const reviewsCollection = database.collection('reviews');

        //Get Cars
        app.get('/cars', async(req,res)=>{
            const cursor = carsCollection.find({});
            const cars = await cursor.toArray();
            res.send(cars);
        })

        //Get Single Car
        app.get('/cars/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const car = await carsCollection.findOne(query);
            res.json(car);
        })

        //Add Cars
        app.post('/cars', async(req,res)=>{
            const cars = req.body;
            const result = await carsCollection.insertOne(cars);
            // console.log(bookings);
            res.json(result);
        })

        //Remove Cars
        app.delete('/cars/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await carsCollection.deleteOne(query);
            // console.log('delete',result);
            res.json(result);
        })

        //make order
        app.post('/orders', async(req,res)=>{
            const orders = req.body;
            const result = await ordersCollection.insertOne(orders);
            // console.log(orders);
            res.json(result);
        })

        //Get All orders
        app.get('/orders', async(req,res)=>{
            const cursor = ordersCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        //Update Single Order
        app.put('/orders/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const updateDoc = {
                $set: {
                  status: "Shipped"
                },
              };
              const result = await ordersCollection.updateOne(query,updateDoc);
            // console.log('updated',result);
            res.json(result);
        })

        //Delete Single User Orders
        app.delete('/orders/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await ordersCollection.deleteOne(query);
            // console.log('delete',result);
            res.json(result);
        })

        //Get Single User Bookings
        app.get('/orders/:email',async(req,res)=>{
            const email = req.params.email;
            const query = {email : email};
            const cursor = ordersCollection.find(query);
            const order = await cursor.toArray()
            res.json(order);
            // console.log(booking);

        })

        //add reviews
        app.post('/reviews', async(req,res)=>{
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            // console.log(orders);
            res.json(result);
        })

        //get reviews
        app.get('/reviews', async(req,res)=>{
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        //save users to database
        app.post('/users',async(req,res)=>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        })

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            
                    const filter = { email: user.email };
                    const updateDoc = { $set: { role: 'admin' } };
                    const result = await usersCollection.updateOne(filter, updateDoc);
                    res.json(result);
                

        })

        //check if admin
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })
        

    }finally{

    }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('hello there!');
})

app.listen(port,()=>{
    console.log('listening from port ',port);
})