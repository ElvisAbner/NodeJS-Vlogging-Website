const express = require("express");
const ejs = require("ejs");
const port = process.env.PORT || 3000;
const _ = require('lodash');

const { homeStartingContent, aboutContent, contactContent } = require('/content');

const app = express();

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
    aboutContent: aboutContent
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
      console.log('Match found!');
    } else { console.log('Not a match');
  }
  });
});

//Port
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
