const express = require('express');
const ObjectId = require("mongodb").ObjectID;

const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://techUser:user1234@cluster0.p0njw.mongodb.net/$techGadgets?retryWrites=true&w=majority`;
const app = express()
app.use(bodyParser.json());
app.use(cors());
const port = 5000





const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log(err);
    const productsCollection = client.db("techGadgets").collection("products");
    const orderCollection = client.db("techGadgets").collection("checkOut");

    app.get('/', (req, res) => {
        res.send('Heroku is Working')
    })
    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    app.get('/product/:id', (req, res) => {
        productsCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })
    app.post("/placeOrder", (req, res) => {
        const product = req.body;
        console.log(product);
        orderCollection.insertOne(product)


        .then(result => {
            console.log('one product added')
            res.redirect('/')

        })

    })
    app.get('/order', (req, res) => {
        orderCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    app.post('/addProducts', (req, res) => {
        const newProduct = req.body;
        console.log('adding new event:', newProduct)
        productsCollection.insertOne(newProduct)
            .then(result => {
                console.log('inserted count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })


    })

    app.delete("/delete/:id", (req, res) => {
        productsCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                console.log(result);

                res.send(result.deletedCount > 0);




            })
    })


});

app.listen(process.env.PORT || port)