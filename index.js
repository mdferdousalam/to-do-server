const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// {
//   origin: ["http://localhost:3000"],
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   // credentials: true,
//   // "Access-Control-Allow-Credentials": true,
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Headers": "*",
// }
// MOngoDB connection 

const url = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.4txcfpw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try {
    const toDosCollection = client.db('todolist').collection('todos')

    app.get('/todos', async (req, res) => {
      const query = {}
      const todos = await toDosCollection.find(query).toArray();
      res.send(todos);
      });


    app.post('/todos', async(req, res) => {
      const todo = { text: req.body.text, done: false };
      const result = await toDosCollection.insertOne(todo)
      res.send(result);
    });

    app.delete('/todos/:id', async (req, res) => {
      const id =req.query.id;
      const filter = {_id: ObjectId(id)}
      const todos = await toDosCollection.deleteOne(filter)
      res.send(todos);
    });


  }
  finally {

  }
  
}

run().catch(console.log);


app.get('/',(req,res)=>{
  res.send('Server connected')
})

app.listen(port, () => {
  console.log(`Connected server on port: ${port}`);
});
