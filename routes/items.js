const express = require('express');
const router = express.Router();

// Bring in Item and Cart model
let Item = require('../models/item');
let Cart = require('../models/cart');


// Access Control
function ensureAuthenticated(req, res, next){
   if(req.isAuthenticated()){
       return next();
   } else {
       req.flash('danger', 'Please login');
       res.redirect('/users/login');
   }
}

// List of items route
router.get('/list', function(req, res){
  Item.find({}, function(err, items){
    if(err){
      console.log(err);
    } else {
      res.render('items_list', {
        items: items
      })
    }
  });
});
// Add item route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_item', {
    title: 'Dodaj przedmiot'
  })
});

// Add item POST
router.post('/add', function(req, res){
  req.checkBody('name', 'Nazwa jest wymagana').notEmpty();
  req.checkBody('quantity', 'Ilość jest wymagana').notEmpty();
  req.checkBody('price_netto', 'Cena netto jest wymagana').notEmpty();
  req.checkBody('tax', 'Wielkość podatku jest wymagana').notEmpty();
  req.checkBody('price_brutto', 'Brak ceny brutto. Kliknij przycisk "Przelicz').notEmpty();
  req.checkBody('profit', 'Brak kwoty zysku. Kliknij przycisk "Przlicz"').notEmpty();
  req.checkBody('bought_price', 'Cena zakupu jest wymagana').notEmpty();
  req.checkBody('commission', 'Prowizja jest wymagana').notEmpty();

  // Getting errors
  let errors = req.validationErrors();
 
  if(errors){
    res.render('add_item', {
      title: 'Dodaj przedmiot',
      errors: errors
    });
  } else {
    let item = new Item();
    item.name = req.body.name;
    item.quantity = req.body.quantity;
    item.price_netto = req.body.price_netto;
    item.tax = req.body.tax;
    item.price_brutto = req.body.price_brutto;
    item.profit = req.body.profit;
    item.bought_price = req.body.bought_price;
    item.commission = req.body.commission;

    item.save(function(err){
      if(err){
        console.log(err);
      } else {
        req.flash('success', 'Dodano przedmiot');
        res.redirect('/');
      }
    });
  }
  
});


// Edit item route
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Item.findById(req.params.id, function(err, item){
    res.render('edit_item', {
      title: 'Edit item',
      item: item
    });
  });
});

// Edit item POST request (save)
router.post('/edit/:id', function(req,res){
  let item = {};
  item.name = req.body.name;
  item.quantity = req.body.quantity;
  item.price_netto = req.body.price_netto;
  item.tax = req.body.tax;
  item.price_brutto = req.body.price_brutto;
  item.profit = req.body.profit;
  item.bought_price = req.body.bought_price;
  item.commission = req.body.commission;

  let query = {_id:req.params.id}

  Item.update(query, item, function(err){
    if(err){
      console.log(err);
    } else {
      req.flash('success', 'Pomyślnie edytowano przedmiot');
      res.redirect('/');
    }
  })
});


// Delete item from db
router.delete('/:id', function(req, res){
  let query = {_id:req.params.id}

  Item.remove(query, function(err){
    if(err){
      console.log(err);
    } else {
      res.send('Success');
    }
  });
})


// Add item to cart
router.get('/add-to-cart/:id', function(req, res){
  let itemId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  Item.findById(itemId, function(err, item){
    if(err){
      req.flash('danger', 'Wystąpił błąd');
      return res.redirect('/');
    }
    cart.add(item, item.id);
    req.session.cart = cart;
    req.flash('success', 'Dodano do koszyka');
    res.redirect('/items/list');
    console.log(cart);
  });
});

// Shopping-cart route
router.get('/shopping-cart', function(req, res){
  if(!req.session.cart){
    return res.render('shopping-cart', {items: null});
  }
  let cart = new Cart(req.session.cart);
  res.render('shopping-cart', {items: cart.generateArray(), totalPrice: cart.totalPrice});
});


module.exports = router;