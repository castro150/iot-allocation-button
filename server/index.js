'use strict'

let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let cors = require('cors');
let nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'iot.allocation.button@gmail.com',
    pass: 'botao123!'
  }
});

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

app.use(cors());

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

  sendPendingEmail();

  let newCall = new Call({
    priority: req.body.priority,
    location: req.body.location,
    moment: req.body.moment
  });

  newCall.attended = false;

  newCall.save(function(err) {
    if (err) {
      return next(err);
    }

    return res.status(201).json('Call added with success!');
  });
});

let sendPendingEmail = function() {
  var cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - 8);

  Call.find({
    attended: false,
    moment: {
      $lt: cutoff
    }
  }, null, {
    sort: {
      moment: 1
    }
  }, function(err, calls) {
    if (err) {
      return next(err);
    }

    if (calls.length > 0) {
      var mailOptions = {
        from: 'iot.allocation.button@gmail.com',
        to: 'bernardosantossuarez@gmail.com',
        subject: 'Chamados do IoT Allocation Button pendentes!',
        text: 'Existem ' + calls.length + ' chamados pendentes a mais de 8 horas!'
      };

      transporter.sendMail(mailOptions, function(err, info){
        if (err) {
          console.log(err);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }

    return;
  });
};

router.get('/calls', function(req, res, next) {
  Call.find({}, null, {
    sort: {
      moment: -1
    }
  }, function(err, calls) {
    if (err) {
      return next(err);
    }

    return res.status(200).json(calls);
  });
});

router.get('/calls/unattended', function(req, res, next) {
  Call.find({
    attended: false
  }, null, {
    sort: {
      moment: 1
    }
  }, function(err, calls) {
    if (err) {
      return next(err);
    }

    let priorityCalls = calls.filter(function(call) {
      return call.priority;
    });

    let notPriorityCalls = calls.filter(function(call) {
      return !call.priority;
    });

    let result = priorityCalls.concat(notPriorityCalls);

    return res.status(200).json(result);
  });
});

router.get('/calls/attended', function(req, res, next) {
  Call.find({
    attended: true
  }, null, {
    sort: {
      attendedTime: -1
    }
  }, function(err, calls) {
    if (err) {
      return next(err);
    }

    return res.status(200).json(calls);
  });
});

router.put('/calls/attend', function(req, res, next) {
  if (!req.body || !req.body.attendedBy) {
    return res.status(400).json('Missing required body propertie.');
  }

  Call.find({
    attended: false
  }, null, {
    sort: {
      moment: 1
    }
  }, function(err, calls) {
    if (err) {
      return next(err);
    }

    let priorityCalls = calls.filter(function(call) {
      return call.priority;
    });

    let notPriorityCalls = calls.filter(function(call) {
      return !call.priority;
    });

    let orderedCalls = priorityCalls.concat(notPriorityCalls);
    let toAttend = {};
    if (orderedCalls.length > 0) {
      toAttend = orderedCalls[0];
      toAttend.attended = true;
      toAttend.attendedBy = req.body.attendedBy;
      toAttend.attendedTime = new Date();

      Call.findByIdAndUpdate(toAttend._id, toAttend, {
        new: true
      }, function(err, attended) {
        return res.status(200).json(attended);
      });
    } else {
      return res.status(204).json();
    }
  });
});

//associate router to url path
app.use('/api', router);

//start the Express server
app.listen(port);
console.log('Listening on port ' + port);
