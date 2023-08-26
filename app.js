const express = require("express");
const mongoose = require('mongoose');
const app = express();
const ejs = require("ejs");
const _ = require('lodash');
require('dotenv').config()

const PORT = process.env.PORT || 3000

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

connectDB().then(() => {
  app.listen(PORT, () => {
      console.log("listening for requests");
  })
})

const postSquema = new mongoose.Schema({
  title: {
    type: String
  },
  content: {
    type: String
  }
})

const Post = new mongoose.model ('Post', postSquema)

const { homeStartingContent,
       aboutStartingContent,
       contactContent } = require('./content');


app.set('view engine', 'ejs');

app.use(express.urlencoded({
  extended: true
}));

app.use(express.static("public"));


//Get requests
app.get('/', (req, res) => {
  
  Post.find({}).then((posts) => {
    res.render('home', {
      homeStartingContent: homeStartingContent,
      posts: posts
    })
  });
})
  
app.get('/about', (req, res) => {
  res.render('about', {
    aboutStartingContent: aboutStartingContent
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', {
    contactContent: contactContent
  });
});

app.get('/compose', (req, res) => {
  res.render('compose');
});

//Post requests 
app.post('/compose', (req, res) => {

    postTitle = req.body.postTitle,
    postContent = req.body.postBody
  
    const post = new Post ({
      title: postTitle,
      content: postContent
    })

    post.save();

  res.redirect('/');
});

//Route parameters
app.get('/posts/:postId', (req, res) => {
  
  const requestedPostId = req.params.postId;
  
  Post.findOne({_id: requestedPostId}).then((post) => {
     res.render('post', {
       title: post.title,
       content: post.content
     });
  })
  .catch((err) => {
    console.log(err)
  });
});
