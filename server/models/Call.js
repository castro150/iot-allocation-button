'use strict'

const mongoose = require('mongoose');

let CallSchema = new mongoose.Schema({
  priority: Boolean,
  location: String
});

mongoose.model('Call', CallSchema);
