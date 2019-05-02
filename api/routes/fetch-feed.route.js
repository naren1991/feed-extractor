const express = require('express');
const router = express.Router();

//Test URL: ?url=http://lorem-rss.herokuapp.com/feed

var FeedParser = require('feedparser');
var request = require('request'); // for fetching the feed

// TODO: Change from query params

router.get('/', function(req,res) {
  return res.send("Set of services for feeds")
 })

router.get('/getFeed', function(req, res){
  
  var request = require('request'); // for fetching the feed
 
  var feedReq = request(req.query.url);
  var options = {};
  var feedparser = new FeedParser([options]);
 
  feedReq.on('error', function (error) {
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

  var feedList = [];
 
  feedparser.on('readable', function () {
    // This is where the action is!
    var stream = this; // `this` is `feedparser`, which is a stream
    var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
    var item;
  
    while (item = stream.read()) {
      //console.log(item);
      feedList.push(item)
    }
  });

  feedparser.on('finish', function(){
    console.log('Finished')
    //console.log(feedList);
    res.send(feedList);
  })

  feedparser.on('end', function(){
    console.log('Ended');
  })

})

module.exports = router;

