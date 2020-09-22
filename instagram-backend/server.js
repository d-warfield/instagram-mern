import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Pusher from 'pusher';
import dbModel from './dbModel.js'
import dotenv from "dotenv";
dotenv.config();


// app config
const app = express();
const port = process.env.PORT || 8080;

// pusher config
const pusher = new Pusher({
  appId: '1077068',
  key: '75a81c9c06abf2a14468',
  secret: 'a87267c8f2ca6396998c',
  cluster: 'us2',
  usetls: true
});

pusher.trigger('my-channel', 'my-event', {
  'message': 'hello world'
});

// app middleware
app.use(express.json());
app.use(cors());

// db connection
const connection_url = `mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.97jcd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log("the db is connected");

  // create watcher for collection posts 
  const changestream = mongoose.connection.collection('posts').watch();

  changestream.on('change', (change) => {
    console.log('Change triggered on pusher...');
    console.log(change);
    console.log('End of change');

    if (change.operationType === 'insert') {
      console.log('Triggering pusher **IMG UPLOAD***');

      const postDetails = change.fullDocument;
      pusher.trigger('posts', 'inserted', {
        user: postDetails.user,
        caption: postDetails.caption,
        image: postDetails.image
      })
    } else {
      console.log('Unknown trigger from pusher')
    }
  })
});

// api routes
app.get('/', (req, res) => res.status(200).send('It works!'));

// post data to db
app.post('/upload', (req, res) => {
  const body = req.body;

  dbModel.create(body, (data) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(201).send(data)
    }
  })
});

// get data from db
app.get('/sync', (req, res) => {
  dbModel.find((err, data) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(data)
    }
  })
})


// listen
app.listen(port, () => console.log(`Listening on port: ${port}`));
