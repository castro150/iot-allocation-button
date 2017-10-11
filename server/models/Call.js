'use strict'

const mongoose = require('mongoose');

let CallSchema = new mongoose.Schema({
  priority: Boolean,
  location: String,
  moment: Date,
  attended: Boolean,
  attendedBy: String,
  attendedTime: Date
});

mongoose.model('Call', CallSchema);
