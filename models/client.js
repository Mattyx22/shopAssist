let mongoose = require('mongoose');

// Client schema
let clientSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  address:{
    type: String,
    required: true
  },
  post_code:{
    type: String,
    required: true
  },
  phone_number:{
    type: Number,
    required: true
  },
  email:{
    type: String
  },
  brought_money:{
    type: Number
  },
  const_discount:{
    type: Number,
    min: 0,
    max: 100
  }
});

let Client = module.exports = mongoose.model('client', clientSchema);