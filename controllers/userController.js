const User = require('../models/user');
const Hotel = require('../models/hotel');
const Order = require('../models/order');
const Passport = require('passport');





// Express validator| "check" will be used in data validation
const { check, validationResult } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');

const querystring = require('querystring');
exports.signUpGet = (req, res) => {
    res.render('sign_up', { title: 'User sign up' });
}

exports.signUpPost = [
    // Validate user data   ".is" is check if
    check('first_name').isLength({ min: 1 }).withMessage('First name must be specified')
    .isAlphanumeric().withMessage('First name must be alphanumeric'),

    check('surname').isLength({ min: 1 }).withMessage('Surname must be specified')
    .isAlphanumeric().withMessage('Surname must be alphanumeric'),

    check('email').isEmail().withMessage('Invalid email address'),

    //value come from our confirm email form & request Object "{}" stored in all other form field & "req.body.email" OG email field
    check('confirm_email')
    .custom( ( value, { req } ) => value === req.body.email )
    .withMessage('Email addresses do not match'),
    
    check('password').isLength({ min: 6 })
    .withMessage('Invalid password, password must be minimum of 6 characters'),

    check('confirm_password')
    .custom( ( value, { req } ) => value === req.body.password )
    .withMessage('Passwords do not match'),

   // put * to target all the input in a field/ target each input as validate above || "trim" remove any white space in inputs 
   //".escape" removes any html characters
    sanitize('*').trim().escape(),

    // validationResult extracts any validation errors
    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            //There are errors
            // res.json(req.body);
            res.render('sign_up', {title: 'Please fix the following errors:', errors: errors.array()});
            return;
        } else {
            //No errors || "function" will reun after registration
            const newUser = new User(req.body);
            User.register(newUser, req.body.password, function(err) {
              if(err) {
                  console.log('error while registering!', err);
                  return next(err); 
              }
              next(); // Move to loginPost after registering
            } );
        }
    }
]

exports.loginGet = (req, res) => {
    res.render('login', { title: 'Login to continue' });
}




exports.loginPost = Passport.authenticate('local', {
  
    successRedirect: '/',
    successFlash: 'You are now logged in',
    failureRedirect: '/login',
    failureFlash: 'login failed, please try again'
}
);



exports.logout = (req, res) => {
   req.logout(); 
   req.flash('info', 'You are now logged out');
   res.redirect('/');
}

// foreignField from hotels collection || localField from order.js
exports.myAccount = async (req, res, next) => {
    try {
      const orders = await Order.aggregate([
        { $match: { user_id: req.user.id } },
        { $lookup: { 
          from: 'hotels',
          localField: 'hotel_id',
          foreignField: '_id',
          as: 'hotel_data'
         } }
      ]); 
      res.render('user_account', { title: 'My account', orders });
    }catch(error) {
      next(error);
    }
}

exports.allOrders = async (req, res, next) => {
  try {
    const orders = await Order.aggregate([
      { $lookup: { 
        from: 'hotels',
        localField: 'hotel_id',
        foreignField: '_id',
        as: 'hotel_data'
       } }
    ]); 
    res.render('orders', { title: 'All orders', orders });
  }catch(error) {
    next(error);
  }
}

exports.orderPlaced = async (req, res, next) => {
    try {
        const data = req.params.data;
        const parsedData = querystring.parse(data);
        const order = new Order({
          user_id: req.user._id,
          hotel_id: parsedData.id,
          order_details: { duration: parsedData.duration,
             dateOfDeparture: parsedData.dateOfDeparture, 
             numberOfGuests: parsedData.numberOfGuests }
        });
        await order.save();
        res.redirect('/my-account');
        req.flash('info', 'Thank you, your order has been placed!');
      }catch(error) {
        next(error);
    }
} 
   
  
  exports.bookingConfirmation = async (req, res, next) => {
    try {
       const data = req.params.data;
       const searchData = querystring.parse(data);
       const hotel = await Hotel.find( { _id: searchData.id } );
    //    res.json(searchData); || "parse" it convert data into json format
    res.render('confirmation', { title: 'Confirm your booking', hotel, searchData });
    } catch(error) {
        next(error);
    }
}

exports.isAdmin = (req, res, next) => {
    if(req.isAuthenticated() && req.user.isAdmin) {
      next();
      return;
    }
  else {
      res.redirect('/');
  }  
}









