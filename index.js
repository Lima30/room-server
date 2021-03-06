const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ldu2w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('database connected succesfully');
        const database = client.db('online_shopHotel');
        const productCollection = database.collection('products');

        //GET Products API
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        //Get Single Service
        app.get('/products/:id', async (req, res) => {
            // console.log(req.params.id);
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await productCollection.findOne(query);
            res.json(service);
        })

        // app.get("/singleProduct/:id", (req, res) => {
        //     console.log(req.params.id);
        // })



    }
    finally {
        //await client.close();
    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('room server is running');

});

app.get('/', (req, res) => {
    res.send('Running room server');
});

app.listen(port, () => {
    console.log('Running Room Server on port', port);
})