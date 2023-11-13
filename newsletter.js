const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.static(__dirname));
app.use('/', bodyParser.urlencoded({ extended: true }));

const mongoURI = 'mongodb://127.0.0.1:27017';
const dbName = 'app';

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', async function (req, res) {
    var first = req.body.first;
    var last = req.body.last;
    var email = req.body.email;

    var data = {
        "email": email,
        "name": {
            "firstname": first,
            "lastname": last
        }
    };

    try {
        // Connect to MongoDB
        const client = await MongoClient.connect(mongoURI, { useNewUrlParser: true });
        const db = client.db(dbName);

        // Insert data into the MongoDB collection
        const collection = db.collection('users');
        await collection.insertOne(data);

        // Find all documents and send them as a response
        const cursor = collection.find();
        const documents = await cursor.toArray();
        
        // Close the connection
        client.close();

        // Send a JSON response
        res.json({ message: "Data sent", data: documents });
    } catch (err) {
        console.error("Error inserting data into MongoDB:", err);
        res.status(500).json({ error: "Data not sent (Error)" });
    }
});

app.listen(8000, function () {
    console.log('Server running at 8000, enter any web browser and type localhost:8000');
});


/*db.collection.find().make(function(filter) {
    filter.where('age', '>', 20);
    filter.where('removed', false);
    filter.callback(function(err, response) {
        console.log(err, response);
    });
});*/
