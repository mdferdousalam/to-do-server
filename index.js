
const express = require('express');
const cors = require('cors');
const app = express();
const mongodb = require('mongodb');
require('dotenv').config();

const MongoClient = mongodb.MongoClient;
const url = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.4txcfpw.mongodb.net/?retryWrites=true&w=majority`;
const dbName = 'todos';

let db;

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Connected successfully to MongoDB');
  db = client.db(dbName);
});

app.use(cors());
app.use(express.json());

app.get('/todos', (req, res) => {
  db.collection('todos').find({}).toArray((err, todos) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }
    res.send(todos);
  });
});

app.post('/todos', (req, res) => {
  const todo = { text: req.body.text, done: false };
  db.collection('todos').insertOne(todo, (err, result) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }
    res.send(result.ops[0]);
  });
});

app.delete('/todos/:id', (req, res) => {
  db.collection('todos').deleteOne({ _id: new mongodb.ObjectID(req.params.id) }, (err, result) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }
    res.sendStatus(200);
  });
});

app.get('/',(req,res)=>{
    res.send('Server connected')

})

app.listen(5000, () => {
  console.log('Listening on port 5000');
});
