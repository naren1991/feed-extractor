const express = require('express');
const app = express();

//const debug = require('debug')('myapp:server');

const port = process.env.PORT || 3000;

const feedRouter = require('./api/routes/fetch-feed.route.js')
app.listen(port, () => {
 console.log('Server is up and running on port ', port);
})

app.get('/', function(req,res) {
  return res.send("Feed extractor is up and running")
 })

 app.use('/feeds', feedRouter);
 