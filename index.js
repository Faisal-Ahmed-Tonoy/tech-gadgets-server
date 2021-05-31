const express = require('express');
const ObjectId = require("mongodb").ObjectID;
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = 5000;
app.use(bodyParser.json());
app.use(cors());

const uri = `mongodb+srv://imagebayDb:hello1234@cluster0.p0njw.mongodb.net/imageBay?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err)
    const servicesCollection = client.db("imageBay").collection("services");
    const orderCollection = client.db("imageBay").collection("book");
    const reviewCollection = client.db("imageBay").collection("review");
    const adminCollection = client.db("imageBay").collection("admin");
    console.log('Database Connected')
    app.get('/', (req, res) => {
        res.send("Heroku is Working")

    })
    app.get('/services', (req, res) => {
        servicesCollection.find({})
            .toArray((err, items) => {
                res.send(items)
                console.log('from database', items)

            })

    })
    app.get('/service/:id', (req, res) => {
        servicesCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.post('/addService', (req, res) => {
        const newService = req.body;
        console.log('adding new event:', newService)
        servicesCollection.insertOne(newService)
            .then(result => {
                console.log('inserted count', result.insertedCount)
                res.send(result.insertedCount > 0)
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
    app.post('/addReview', (req, res) => {
        const newReview = req.body;
        console.log('adding new event:', newReview)
        reviewCollection.insertOne(newReview)
            .then(result => {
                console.log('inserted count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })




    })


    app.get('/review', (req, res) => {
        reviewCollection.find()
            .toArray((err, items) => {
                res.send(items)
                console.log('from database', items)

            })

    })
    app.get('/adminServiceList', (req, res) => {
        orderCollection.find({})
            .toArray((err, document) => {
                res.send(document)
            })
    })

    app.delete("/delete/:id", (req, res) => {
        servicesCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                console.log(result);

                res.send(result.deletedCount > 0);




            })
    })
    app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body;
        console.log('adding new event:', newAdmin)
        adminCollection.insertOne(newAdmin)
            .then(result => {
                console.log('inserted count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })




    })
    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        console.log(email);
        adminCollection.find({ email: email })
            .toArray((err, admin) => {
                res.send(admin.length > 0);
            });
    });



});
app.listen(process.env.PORT || port)