//TODO: Clean this up and add the functions to a controller

const express = require('express');

const router = express.Router();

const kafka = require('kafka-node');
const bp = require('body-parser');
const config = require('../../config/kafka.config.js');

const Producer = kafka.Producer;
const client = new kafka.KafkaClient(config.kafka_server);
const producer = new Producer(client);
//const kafka_topic = config.kafka_topic;

//Test URL: http://lorem-rss.herokuapp.com/feed

var FeedParser = require('feedparser');
var request = require('request'); // for fetching the feed

router.get('/', function(req,res) {
  return res.send("Set of services for feeds")
 })

router.post('/get', function(req, res){
  
  var request = require('request'); // for fetching the feed
 
  var feedReq = request(req.body.url);
  var options = {};
  var feedparser = new FeedParser([options]);
 
  var kafka_topic = req.body.topic;
  console.log(kafka_topic);

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

  //var feedList = [];
  var feedCount = 0;
 
  feedparser.on('readable', function () {
    // This is where the action is!
    var stream = this; // `this` is `feedparser`, which is a stream
    var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
    var item;
  
    while (item = stream.read()) {
      //console.log("item");
      //feedList.push(item)

      try{
        let payloads = [
          {
            topic: kafka_topic,
            messages: item,
            timestamp: Date.now() 
          }
        ];

        //console.log(payloads)
        //producer.on('ready', async function() {
        let push_status = producer.send(payloads, function(err, data) {
          if (err) {
            console.log('[kafka-producer -> '+kafka_topic+']: broker update failed');
          } else {
            console.log('[kafka-producer -> '+kafka_topic+']: broker update success');
          }
        });

        //TODO: implement count inside the send
        feedCount++
        //});

        producer.on('error', function(err) {
          console.log(err);
          console.log('[kafka-producer -> '+kafka_topic+']: connection errored');
          throw err;
        });
      }catch(e) {
        console.log(e);
      }
    }
  });

  feedparser.on('finish', function(){
    console.log('Finished')
    //console.log(feedList);
    res.send(feedCount + " items were fetched from the feed and added to the Kafka topic '" +
     kafka_topic + "'")
  })

  feedparser.on('end', function(){
    console.log('Ended');
  })

})

module.exports = router;

