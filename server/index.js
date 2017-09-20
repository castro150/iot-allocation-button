'use strict'

let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mongoose = require('mongoose');

// importig models for the app
require('./models/Call');

let DB_URL = process.env.MONGODB_URI || 'mongodb://heroku_9884mjmt:agmhnf1a7pqpajl1hlh6dkec46@ds133814.mlab.com:33814/heroku_9884mjmt';
mongoose.connect(DB_URL, {
  useMongoClient: true
});

//init bodyParser to extract properties from POST data
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

let port = process.env.PORT || 8080;

//init Express Router
let router = express.Router();

//default/test route
router.get('/', function(req, res) {
  res.json({
    message: 'App is running!'
  });
});

const Call = mongoose.model('Call');

router.post('/calls', function(req, res, next) {
  if (!req.body || !req.body.location) {
    return res.status(400).json('Missing required body propertie.');
  }

  let newCall = new Call({
    priority: req.body.priority,
    location: req.body.location
  });

  newCall.moment = new Date();
  newCall.replayed = false;

  newCall.save(function(err) {
    if (err) {
      return next(err);
    }

    return res.status(200).json('Call added with success!');
  });
});

//associate router to url path
app.use('/api', router);

//start the Express server
app.listen(port);
console.log('Listening on port ' + port);
