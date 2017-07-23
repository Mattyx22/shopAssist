const express = require('express');
const router = express.Router();

// Bring in clients module
let Client = require('../models/client');


// Add client route
router.get('/add', function(req, res){
  res.render('add_client', {
    title: 'Nowy klient'
  });
});


// Add client POST
router.post('/add', function(req, res){
  req.assert('name', 'Imię i nazwisko jest wymagane').notEmpty();
  req.assert('address', 'Adres jest wymagany').notEmpty();
  req.assert('post_code', 'Kod pocztowy jest wymagany').notEmpty();
  req.assert('phone_number', 'Numer telefonu jest wymagany').notEmpty();

  req.getValidationResult().then(function(result) {
    let errors = result.array();
    let areEmpty = result.isEmpty();
    if(!areEmpty){
      res.render('add_client', {
        title: 'Nowy klient',
        errors: errors
      });
    } else {
      let client = new Client();
      client.name = req.body.name;
      client.address = req.body.address;
      client.post_code = req.body.post_code;
      client.phone_number = req.body.phone_number;
      client.email = req.body.email;
      client.const_discount = req.body.const_discount;

      client.save(function(err){
        if (err){
          console.log(err);
        } else {
          req.flash('success', 'Dodano klienta');
          res.redirect('/clients/list');
        }
      });
    }
  });
});


// Clients list route
router.get('/list', function(req, res){
  Client.find({}, function(err, clients){
    if (err){
      console.log(err);
    } else {
      res.render('clients_list', {
        clients: clients
      });
    }
  })
});


// Edit client route
router.get('/edit/:id', function(req, res){
  Client.findById(req.params.id, function(err, client){
    res.render('edit_client', {
      client: client
    })
  });
});

// Edit client POST
router.post('/edit/:id', function(req, res){
  req.assert('name', 'Imię i nazwisko jest wymagane').notEmpty();
  req.assert('address', 'Adres jest wymagany').notEmpty();
  req.assert('post_code', 'Kod pocztowy jest wymagany').notEmpty();
  req.assert('phone_number', 'Numer telefonu jest wymagany').notEmpty();

  Client.findById(req.params.id, function(err, client){
    req.getValidationResult().then(function(result){
    let errors = result.array();
    let areEmpty = result.isEmpty();

    if(!areEmpty){
      res.render('edit_client', {
        client: client,
        errors: errors
      });
    } else {
      let client = {}
      client.name = req.body.name;
      client.address = req.body.address;
      client.post_code = req.body.post_code;
      client.phone_number = req.body.phone_number;
      client.email = req.body.email;
      client.const_discount = req.body.const_discount;

      let query = {_id:req.params.id}

      Client.update(query, client, function(err){
        if(err){
          console.log(err);
        } else {
          req.flash('success', 'Pomyślnie edytowano klienta')
          res.redirect('/clients/list');
        }
      });
    }
  });
  });
  
});

module.exports = router;