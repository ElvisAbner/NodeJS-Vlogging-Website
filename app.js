const express = require("express");
const app = express();
const ejs = require("ejs");
const port = process.env.PORT || 3000;
const _ = require('lodash');

const { homeStartingContent, aboutStartingContent, contactContent } = require('./content');

const posts = [];

app.set('view engine', 'ejs');

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));


//Get requests
app.get('/', (req, res) => {
  res.render('home', {
    homeStartingContent: homeStartingContent,
    posts: posts
  });
});

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

  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };

  posts.push(post);

  res.redirect('/');
});

//Route parameters
app.get('/posts/:postName', (req, res) => {
  
  const requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach((post) => {
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render('post', {
        title: post.title,
        content: post.content
      });
    };
  });
});

//Port
app.listen(port, () => {
  console.log("Server Started!!!");
});