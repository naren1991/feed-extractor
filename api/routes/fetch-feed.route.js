const express = require('express');
const router = express.Router();

var FeedParser = require('feedparser');
var request = require('request'); // for fetching the feed


router.get('/', function(req,res) {
  return res.send("Set of services for feeds")
 })

router.get('/getFeed', function(req, res){
  
  var request = require('request'); // for fetching the feed
 
  var feedReq = request(req.query.url);
  var options = {};
  var feedparser = new FeedParser([options]);
 
  req.on('error', function (error) {
    // handle any request errors
  });
 
  feedReq.on('response', function (res) {
    var stream = this; // `this` is `req`, which is a stream
  
    if (res.statusCode !== 200) {
      this.emit('error', new Error('Bad status code'));
    }
    else {
      stream.pipe(feedparser);
    }
  });
 
  feedparser.on('error', function (error) {
    // always handle errors
  });
 
  feedparser.on('readable', function () {
    // This is where the action is!
    var stream = this; // `this` is `feedparser`, which is a stream
    var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
    var item;
  
    while (item = stream.read()) {
      console.log(item);
      
    }
  });

  res.send("Fetched")
})

module.exports = router;

