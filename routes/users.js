const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let User = require('../models/user');

// Register form route
router.get('/register', function(req, res){
  res.render('register');
});

// Register POST route
router.post('/register', function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;
  const reg_code = req.body.reg_code;

  // Validation
  req.checkBody('name', 'Imię i nazwisko jest wymagane').notEmpty();
  req.checkBody('email', 'E-mail jest wymagany').notEmpty();
  req.checkBody('email', 'E-mail jest nieprawidłowy').isEmail();
  req.checkBody('username', 'Nazwa użytkownika jest wymagana').notEmpty();
  req.checkBody('password', 'Hasło jest wymagane').notEmpty();
  req.checkBody('password2', 'Hasła do siebie nie pasują').equals(req.body.password);
  req.checkBody('reg_code', 'Nie prawidłowy kod rejestracyjny').equals('123');

  // Checking for validation errors
  let errors = req.validationErrors();
  if(errors){
    res.render('register', {
      errors: errors
    });
  } else {
    let newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password
    });

  // Crypting password and saving user to db
  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(newUser.password, salt, function(err, hash){
      if(err){
        console.log(err); 
      }
      
      newUser.password = hash;
      newUser.save(function(err){
        if(err){ 
          console.log(err);
        }
        req.flash('success', 'Poprawnie zarejestrowano. Można się zalogować.');
        res.redirect('/');
      });
    });
  });

  }
});


// Login form
router.get('/login', function(req, res){
  res.render('login');
});

// Login POST process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'Nastąpiło pomyślne wylogowanie');
  res.redirect('/');
});

//User's profile
router.get('/profile/:id', function(req, res){
  User.findById(req.params.id, function(err, user){
    res.render('profile', {
      title: 'Profil użytkownika',
      user: user
    });
  });
});

// User's profile edit POST
router.post('/profile/:id', function(req, res){
  // Validation
  req.assert('name', 'Imię i nazwisko jest wymagane').notEmpty();
  req.assert('email', 'Email jest wymagany').notEmpty();
  req.assert('email', 'Email jest nieprawidłowy').isEmail();
  req.assert('password', 'Potwierdź zmiany hasłem').notEmpty();
  req.assert('password2', 'Hasła do siebie nie pasują').equals(req.body.password);
  
  User.findById(req.params.id, function(err, user){
    req.getValidationResult().then(function(result){
      let errors = result.array();
      let areEmpty = result.isEmpty();
      console.log(errors);
      console.log(areEmpty);
      if(!areEmpty){
        res.render('profile', {
          title: 'Profil użytkownika',
          user: user,
          errors: errors
        });
      } else {
        let user = {};
        user.name = req.body.name;
        user.email = req.body.email;
        user.password = req.body.password;

        // Crypting password
        bcrypt.genSalt(10, function(err, salt){
          bcrypt.hash(user.password, salt, function(err, hash){
            if(err){
              console.log(err); 
            }
            
            user.password = hash;
            let query = {_id:req.params.id};

            User.update(query, user, function(err){
              if(err){
                console.log(err);
              } else {
                req.flash('success', 'Pomyślnie edytowano profil użytkownika');
                res.redirect('/');
              }
            });
          });
        });
        
        

      }
    });
  });
});  
      

module.exports = router;