var express = require('express');
var router = express.Router();
const passport = require('passport');
const User = require('../model/user'); // Import the User model

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET Login Page */
router.get('/login', function(req, res) {
  res.render('login', { title: 'Login' }); // Render the login page
});

/* POST Login */
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/inventory', // Redirect to inventory on success
    failureRedirect: '/users/login', // Redirect back to login on failure
    failureFlash: true, // Enable failure messages
  })
);

/* GET Register Page */
router.get('/register', function(req, res) {
  res.render('register', { title: 'Register' }); // Render the registration page
});

/* POST Register */
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('register', {
        title: 'Register',
        error: 'Email is already registered.',
      });
    }

    // Create new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Redirect to login after successful registration
    res.redirect('/users/login');
  } catch (err) {
    console.error(err);
    res.render('register', {
      title: 'Register',
      error: 'Error registering user. Please try again.',
    });
  }
});

/* GET Logout */
router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/users/login'); // Redirect to login after logout
  });
});

module.exports = router;