const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//const debug = require('debug')('myapp:server');

const port = process.env.PORT || 3000;

const feedRouter = require('./api/routes/fetch-feed.route.js')
app.listen(port, () => {
 console.log('Server is up and running on port ', port);
})

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

app.get('/', function(req,res) {
  return res.send("Feed extractor is up and running")
 })

 app.use('/feeds', feedRouter);
 