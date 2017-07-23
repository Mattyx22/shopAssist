let mongoose = require('mongoose');


// Item schema
let itemSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  quantity:{
    type: Number,
    min: 0,
    max: 9999,
    required: true
  },
  price_netto:{
    type: Number,
    required: true
  },
  tax:{
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  price_brutto:{
    type: Number,
    required: true
  },
  profit:{
    type: Number,
    required: true
  },
  bought_price:{
    type: Number,
    min: 0,
    max: 9999,
    required: true
  },
  commission:{
    type: Number,
    required: true
  }
});

let Item = module.exports = mongoose.model('item', itemSchema)