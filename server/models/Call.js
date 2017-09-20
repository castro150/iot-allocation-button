'use strict'

const mongoose = require('mongoose');

let CallSchema = new mongoose.Schema({
  priority: Boolean,
  location: String,
  moment: Date,
  replayed: Boolean
});

mongoose.model('Call', CallSchema);
